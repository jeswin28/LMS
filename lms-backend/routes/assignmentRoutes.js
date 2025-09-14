// lms-backend/routes/assignmentRoutes.js
const express = require('express');
const { createAssignment, updateAssignment, deleteAssignment } = require('../controllers/assignmentController');
const { protect, isInstructor } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/courses/:courseId/assignments', protect, isInstructor, createAssignment);
router.put('/assignments/:assignmentId', protect, isInstructor, updateAssignment);
router.delete('/assignments/:assignmentId', protect, isInstructor, deleteAssignment);

module.exports = router;