const express = require('express');
const { submitAssignment, getAssignmentSubmissions, gradeSubmission, getSubmissions, getRecentSubmissions } = require('../controllers/submissionController');
const { protect, isInstructor } = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all submissions (instructor only)
router.get('/', protect, isInstructor, getSubmissions);

// Get recent submissions (instructor only)
router.get('/recent', protect, isInstructor, getRecentSubmissions);

router.post('/assignments/:assignmentId/submissions', protect, submitAssignment); // Student only (checked in controller)
router.post('/assignments/:assignmentId/submit', protect, submitAssignment);
router.get('/assignments/:assignmentId/submissions', protect, isInstructor, getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', protect, isInstructor, gradeSubmission);

module.exports = router; 