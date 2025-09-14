// lms-backend/controllers/enrollmentController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Enrollment, Course, Lesson, User } = require('../models');

// @desc    Enroll in a course (student only)
// @route   POST /api/enrollments
// @access  Private/Students
exports.enrollInCourse = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'student') {
    return next(new ErrorResponse('Only students can enroll in courses', 403));
  }
  const { courseId } = req.body;
  const course = await Course.findByPk(courseId);
  if (!course || course.status !== 'approved') {
    return next(new ErrorResponse('Course not found or not approved', 404));
  }
  // Prevent duplicate enrollment
  const existing = await Enrollment.findOne({ where: { userId: req.user.id, courseId } });
  if (existing) {
    return next(new ErrorResponse('Already enrolled in this course', 400));
  }
  const enrollment = await Enrollment.create({
    userId: req.user.id,
    courseId,
    status: 'active',
    progress: 0,
    completedLessons: 0,
    totalLessons: course.totalLessons || 0,
    startDate: new Date(),
  });
  res.status(201).json({ success: true, enrollment });
});

// @desc    Get all enrollments for the current user
// @route   GET /api/enrollments
// @access  Private
exports.getEnrollments = asyncHandler(async (req, res, next) => {
  const enrollments = await Enrollment.findAll({
    where: { userId: req.user.id },
    include: [
      { model: Course, as: 'course', include: [{ model: User, as: 'instructor', attributes: ['id', 'name', 'email'] }] }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

// @desc    Get all courses the student is enrolled in
// @route   GET /api/enrollments/my-courses
// @access  Private/Students
exports.getMyCourses = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'student') {
    return next(new ErrorResponse('Only students can view their enrollments', 403));
  }
  const enrollments = await Enrollment.findAll({
    where: { userId: req.user.id },
    include: [
      { model: Course, as: 'course', include: [{ model: User, as: 'instructor', attributes: ['id', 'name', 'email'] }] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({ success: true, count: enrollments.length, enrollments });
});

// @desc    Mark a lesson as complete (update progress)
// @route   PUT /api/enrollments/progress
// @access  Private/Students
exports.markLessonComplete = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'student') {
    return next(new ErrorResponse('Only students can update progress', 403));
  }
  const { courseId, lessonId } = req.body;
  const enrollment = await Enrollment.findOne({ where: { userId: req.user.id, courseId } });
  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }
  // For simplicity, assume completedLessons is a count; in a real app, track lesson IDs
  enrollment.completedLessons = (enrollment.completedLessons || 0) + 1;
  // Optionally, update progress percentage
  const course = await Course.findByPk(courseId);
  if (course && course.totalLessons) {
    enrollment.progress = Math.min(100, Math.round((enrollment.completedLessons / course.totalLessons) * 100));
  }
  await enrollment.save();
  res.status(200).json({ success: true, enrollment });
});