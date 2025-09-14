const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Submission, Assignment, Enrollment, Course } = require('../models');

// Student submits assignment (POST /api/assignments/:assignmentId/submit)
exports.submitAssignment = asyncHandler(async (req, res, next) => {
    const assignment = await Assignment.findByPk(req.params.assignmentId);
    if (!assignment) return next(new ErrorResponse('Assignment not found', 404));
    // Check enrollment
    const enrollment = await Enrollment.findOne({ where: { userId: req.user.id, courseId: assignment.courseId } });
    if (!enrollment) return next(new ErrorResponse('Not enrolled in this course', 403));
    // Only one submission per assignment per student
    const existing = await Submission.findOne({ where: { assignmentId: assignment.id, studentId: req.user.id } });
    if (existing) return next(new ErrorResponse('Already submitted', 400));
    const { fileUrl, fileName, fileSize, submissionText } = req.body;
    const submission = await Submission.create({
        assignmentId: assignment.id, studentId: req.user.id, courseId: assignment.courseId,
        fileUrl, fileName, fileSize, submissionText, submittedAt: new Date(), status: 'pending'
    });
    res.status(201).json({ success: true, submission });
});

// Instructor views all submissions for an assignment
exports.getAssignmentSubmissions = asyncHandler(async (req, res, next) => {
    const assignment = await Assignment.findByPk(req.params.assignmentId);
    if (!assignment) return next(new ErrorResponse('Assignment not found', 404));
    if (req.user.role !== 'admin' && assignment.instructorId !== req.user.id)
        return next(new ErrorResponse('Not authorized', 403));
    const submissions = await Submission.findAll({ where: { assignmentId: assignment.id } });
    res.status(200).json({ success: true, count: submissions.length, submissions });
});

// Instructor grades a submission
exports.gradeSubmission = asyncHandler(async (req, res, next) => {
    const submission = await Submission.findByPk(req.params.submissionId);
    if (!submission) return next(new ErrorResponse('Submission not found', 404));
    const assignment = await Assignment.findByPk(submission.assignmentId);
    if (!assignment) return next(new ErrorResponse('Assignment not found', 404));
    if (req.user.role !== 'admin' && assignment.instructorId !== req.user.id)
        return next(new ErrorResponse('Not authorized', 403));
    const { grade, feedback } = req.body;
    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedBy = req.user.id;
    submission.gradedAt = new Date();
    await submission.save();
    res.status(200).json({ success: true, submission });
});

// Get all submissions for instructor
exports.getSubmissions = asyncHandler(async (req, res, next) => {
    const submissions = await Submission.findAll({
        include: [
            { model: Assignment, as: 'assignment' },
            { model: Course, as: 'course' }
        ],
        order: [['submittedAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
});

// Get recent submissions for instructor
exports.getRecentSubmissions = asyncHandler(async (req, res, next) => {
    const submissions = await Submission.findAll({
        include: [
            { model: Assignment, as: 'assignment' },
            { model: Course, as: 'course' }
        ],
        order: [['submittedAt', 'DESC']],
        limit: 10
    });
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
});

// @desc    Get all submissions (instructor/admin only)
// @route   GET /api/submissions
// @access  Private/Instructor
exports.getSubmissions = asyncHandler(async (req, res, next) => {
    let whereClause = {};

    if (req.user.role === 'instructor') {
        // Get submissions for courses taught by the instructor
        const courses = await Course.findAll({ 
            where: { instructorId: req.user.id },
            attributes: ['id']
        });
        const courseIds = courses.map(course => course.id);
        whereClause.courseId = courseIds;
    }

    const submissions = await Submission.findAll({
        where: whereClause,
        include: [
            { model: Assignment, as: 'assignment', attributes: ['id', 'title'] },
            { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
            { model: Course, as: 'course', attributes: ['id', 'title'] }
        ],
        order: [['submittedAt', 'DESC']]
    });

    res.status(200).json({ success: true, count: submissions.length, data: submissions });
});

// @desc    Get recent submissions (instructor/admin only)
// @route   GET /api/submissions/recent
// @access  Private/Instructor
exports.getRecentSubmissions = asyncHandler(async (req, res, next) => {
    let whereClause = {};

    if (req.user.role === 'instructor') {
        // Get submissions for courses taught by the instructor
        const courses = await Course.findAll({ 
            where: { instructorId: req.user.id },
            attributes: ['id']
        });
        const courseIds = courses.map(course => course.id);
        whereClause.courseId = courseIds;
    }

    const submissions = await Submission.findAll({
        where: whereClause,
        include: [
            { model: Assignment, as: 'assignment', attributes: ['id', 'title'] },
            { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
            { model: Course, as: 'course', attributes: ['id', 'title'] }
        ],
        order: [['submittedAt', 'DESC']],
        limit: 10
    });

    res.status(200).json({ success: true, count: submissions.length, data: submissions });
}); 