const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Lesson, Course, Enrollment } = require('../models');

// @desc    Add a lesson to a course (instructor only, must own course)
// @route   POST /api/courses/:courseId/lessons
// @access  Private/Instructors
exports.addLesson = asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.courseId);
    if (!course) {
        return next(new ErrorResponse('Course not found', 404));
    }
    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
        return next(new ErrorResponse('Not authorized to add lessons to this course', 403));
    }
    const { title, content, videoUrl, order } = req.body;
    const lesson = await Lesson.create({
        title,
        content,
        videoUrl,
        order,
        courseId: course.id,
        instructorId: course.instructorId,
    });
    res.status(201).json({ success: true, lesson });
});

// @desc    Get a lesson by ID (enrolled student or instructor)
// @route   GET /api/lessons/:lessonId
// @access  Private/Enrolled Student or Instructor
exports.getLessonById = asyncHandler(async (req, res, next) => {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) {
        return next(new ErrorResponse('Lesson not found', 404));
    }
    const course = await Course.findByPk(lesson.courseId);
    if (!course) {
        return next(new ErrorResponse('Course not found', 404));
    }
    // Allow if instructor or admin
    if (req.user.role === 'admin' || course.instructorId === req.user.id) {
        return res.status(200).json({ success: true, lesson });
    }
    // Allow if student is enrolled
    const enrollment = await Enrollment.findOne({ where: { userId: req.user.id, courseId: course.id } });
    if (!enrollment) {
        return next(new ErrorResponse('Not authorized to view this lesson', 403));
    }
    res.status(200).json({ success: true, lesson });
});

// @desc    Update a lesson (instructor only, must own course)
// @route   PUT /api/lessons/:lessonId
// @access  Private/Instructors
exports.updateLesson = asyncHandler(async (req, res, next) => {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) {
        return next(new ErrorResponse('Lesson not found', 404));
    }
    const course = await Course.findByPk(lesson.courseId);
    if (!course) {
        return next(new ErrorResponse('Course not found', 404));
    }
    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this lesson', 403));
    }
    const updatableFields = ['title', 'content', 'videoUrl', 'order'];
    updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
            lesson[field] = req.body[field];
        }
    });
    await lesson.save();
    res.status(200).json({ success: true, lesson });
});

// @desc    Delete a lesson (instructor only, must own course)
// @route   DELETE /api/lessons/:lessonId
// @access  Private/Instructors
exports.deleteLesson = asyncHandler(async (req, res, next) => {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) {
        return next(new ErrorResponse('Lesson not found', 404));
    }
    const course = await Course.findByPk(lesson.courseId);
    if (!course) {
        return next(new ErrorResponse('Course not found', 404));
    }
    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
        return next(new ErrorResponse('Not authorized to delete this lesson', 403));
    }
    await lesson.destroy();
    res.status(200).json({ success: true, message: 'Lesson deleted' });
}); 