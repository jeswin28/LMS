// lms-backend/controllers/assignmentController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Assignment, Course } = require('../models');
const Enrollment = require('../models/Enrollment');
const { createNotification } = require('./notificationController'); // Import notification helper
const path = require('path');
const fs = require('fs');

// @desc      Get all assignments (for student: their assignments; for instructor/admin: all or by course)
// @route     GET /api/assignments
// @access    Private
exports.getAssignments = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === 'student') {
    // For students, find assignments related to their enrolled courses
    const enrollments = await Enrollment.find({ user: req.user.id }).select('course');
    const courseIds = enrollments.map(enrollment => enrollment.course);
    query = Assignment.find({ course: { $in: courseIds } });
  } else if (req.user.role === 'instructor') {
    // For instructors, find assignments for courses they teach
    const courses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = courses.map(course => course._id);
    query = Assignment.find({ course: { $in: courseIds } });
  } else if (req.user.role === 'admin') {
    // Admins can see all assignments
    query = Assignment.find();
  } else {
    return next(new ErrorResponse('Not authorized to access assignments', 403));
  }

  const assignments = await query.populate({
    path: 'course',
    select: 'title',
  });

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments,
  });
});

// @desc      Get a single assignment
// @route     GET /api/assignments/:id
// @access    Private
exports.getAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id).populate({
    path: 'course',
    select: 'title',
  });

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id ${req.params.id}`, 404));
  }

  // Authorization: Student can view if enrolled, Instructor if they own course, Admin can view all
  if (req.user.role === 'student') {
    const enrollment = await Enrollment.findOne({ user: req.user.id, course: assignment.course });
    if (!enrollment) {
      return next(new ErrorResponse(`Not authorized to view this assignment`, 403));
    }
  } else if (req.user.role === 'instructor') {
    const course = await Course.findById(assignment.course);
    if (!course || course.instructor.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to view this assignment`, 403));
    }
  } // Admin has access by default due to authorize middleware

  res.status(200).json({
    success: true,
    data: assignment,
  });
});

// Create assignment (Instructor only)
exports.createAssignment = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.courseId);
  if (!course) return next(new ErrorResponse('Course not found', 404));
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id)
    return next(new ErrorResponse('Not authorized', 403));
  const { title, description, dueDate, maxPoints } = req.body;
  const assignment = await Assignment.create({
    title, description, dueDate, maxPoints, courseId: course.id, instructorId: course.instructorId,
  });
  res.status(201).json({ success: true, assignment });
});

// Update assignment (Instructor only)
exports.updateAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findByPk(req.params.assignmentId);
  if (!assignment) return next(new ErrorResponse('Assignment not found', 404));
  if (req.user.role !== 'admin' && assignment.instructorId !== req.user.id)
    return next(new ErrorResponse('Not authorized', 403));
  const updatableFields = ['title', 'description', 'dueDate', 'maxPoints'];
  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) assignment[field] = req.body[field];
  });
  await assignment.save();
  res.status(200).json({ success: true, assignment });
});

// Delete assignment (Instructor only)
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findByPk(req.params.assignmentId);
  if (!assignment) return next(new ErrorResponse('Assignment not found', 404));
  if (req.user.role !== 'admin' && assignment.instructorId !== req.user.id)
    return next(new ErrorResponse('Not authorized', 403));
  await assignment.destroy();
  res.status(200).json({ success: true, message: 'Assignment deleted' });
});

// @desc      Submit an assignment
// @route     POST /api/assignments/:id/submit
// @access    Private/Student
exports.submitAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);
  const studentId = req.user.id;

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id ${req.params.id}`, 404));
  }

  // Check if student is enrolled in the course
  const enrollment = await Enrollment.findOne({ user: studentId, course: assignment.course });
  if (!enrollment) {
    return next(new ErrorResponse(`You are not enrolled in the course for this assignment`, 403));
  }

  // Check if assignment is overdue (optional logic based on dueDate)
  if (assignment.dueDate && new Date() > assignment.dueDate) {
    // return next(new ErrorResponse('Assignment is overdue and cannot be submitted', 400));
    console.warn(`Student ${studentId} submitted overdue assignment ${assignment._id}`);
  }

  // Handle file upload if provided
  let fileUrl = null;
  let fileName = null;
  let fileSize = null;

  if (req.file) {
    const file = req.file;
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `File ${file.originalname} is too large. Max size is ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
          400
        )
      );
    }

    // Create custom filename
    fileName = `submission_${studentId}_${assignment._id}${path.parse(file.originalname).ext}`;
    fileUrl = `/uploads/submissions/${fileName}`; // Ensure this directory exists
    fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    // Move the file
    file.mv(`${process.cwd()}/uploads/submissions/${fileName}`, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
    });
  }

  const submissionText = req.body.submissionText;

  if (!fileUrl && !submissionText) {
    return next(new ErrorResponse('Please provide either a file or text submission', 400));
  }

  // Check if there's an existing submission for this assignment by this student
  let submission = await Submission.findOne({ assignment: assignment._id, student: studentId });

  if (submission) {
    // If exists, update it (resubmission)
    submission.fileUrl = fileUrl || submission.fileUrl;
    submission.fileName = fileName || submission.fileName;
    submission.fileSize = fileSize || submission.fileSize;
    submission.submissionText = submissionText || submission.submissionText;
    submission.submittedAt = Date.now();
    submission.status = 'pending'; // Reset status to pending for resubmission
    submission.grade = undefined; // Clear grade on resubmission
    submission.feedback = undefined; // Clear feedback on resubmission
    await submission.save();
  } else {
    // If no existing submission, create new one
    submission = await Submission.create({
      assignment: assignment._id,
      student: studentId,
      course: assignment.course,
      fileUrl,
      fileName,
      fileSize,
      submissionText,
      status: 'pending',
    });

    // Optionally update enrollment with submission reference (only for first submission)
    await Enrollment.findOneAndUpdate(
      { user: studentId, course: assignment.course },
      { $push: { assignmentSubmissions: { assignmentId: assignment._id, submissionId: submission._id, submittedAt: Date.now() } } },
      { new: true, upsert: true }
    );
  }

  res.status(201).json({
    success: true,
    data: submission,
  });
});

// @desc      Get a single submission
// @route     GET /api/assignments/submissions/:id
// @access    Private/Instructor, Admin
exports.getSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id)
    .populate({
      path: 'assignment',
      select: 'title dueDate maxPoints',
    })
    .populate({
      path: 'student',
      select: 'name email',
    })
    .populate({
      path: 'course',
      select: 'title instructor',
    });

  if (!submission) {
    return next(new ErrorResponse(`Submission not found with id ${req.params.id}`, 404));
  }

  // Authorization: Instructor if they own course, Admin can view all
  if (req.user.role === 'instructor') {
    if (!submission.course || submission.course.instructor.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to view this submission`, 403));
    }
  } else if (req.user.role === 'student' && submission.student.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to view this submission`, 403));
  }
  // Admin has access by default

  res.status(200).json({
    success: true,
    data: submission,
  });
});

// @desc      Grade a submission
// @route     PUT /api/assignments/submissions/:id
// @access    Private/Instructor, Admin
exports.gradeSubmission = asyncHandler(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(new ErrorResponse(`Submission not found with id ${req.params.id}`, 404));
  }

  const course = await Course.findById(submission.course);
  // Make sure user is course owner or admin
  if (!course || (course.instructor.toString() !== req.user.id && req.user.role !== 'admin')) {
    return next(new ErrorResponse(`Not authorized to grade this submission`, 403));
  }

  const { grade, feedback, status } = req.body;

  submission.grade = grade;
  submission.feedback = feedback;
  submission.status = status || 'graded'; // Default to 'graded'
  submission.gradedBy = req.user.id;
  submission.gradedAt = Date.now();

  await submission.save();

  // Update the enrollment record with the new grade/feedback
  await Enrollment.findOneAndUpdate(
    { user: submission.student, course: submission.course, "assignmentSubmissions.assignmentId": submission.assignment },
    { $set: { "assignmentSubmissions.$.grade": grade, "assignmentSubmissions.$.feedback": feedback } },
    { new: true }
  );

  // Notify student about graded assignment
  await createNotification({
    user: submission.student,
    type: 'grade',
    title: `Assignment Graded: ${submission.assignment.title}`,
    message: `Your assignment "${submission.assignment.title}" in ${course.title} has been graded: ${grade}/${course.maxPoints}.`,
    course: course._id,
    relatedEntity: { id: submission._id, type: 'Submission' }
  });


  res.status(200).json({
    success: true,
    data: submission,
  });
});

// @desc      Get assignments for a specific course
// @route     GET /api/assignments/course/:courseId
// @access    Private/Instructor, Admin
exports.getCourseAssignments = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ErrorResponse(`Course not found with id ${req.params.courseId}`, 404));
  }

  // Authorization: Instructor if they own course, Admin can view all
  if (req.user.role === 'instructor') {
    if (course.instructor.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to view assignments for this course`, 403));
    }
  } // Admin has access by default

  const assignments = await Assignment.find({ course: req.params.courseId }).populate({
    path: 'course',
    select: 'title',
  });

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments,
  });
});