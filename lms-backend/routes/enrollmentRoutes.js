// lms-backend/routes/enrollmentRoutes.js
const express = require('express');
const {
  enrollInCourse,
  getEnrollments,
  getMyCourses,
  markLessonComplete,
} = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Enroll in a course (student only)
router.post('/', protect, enrollInCourse);

// Get all enrollments for the current user
router.get('/', protect, getEnrollments);

// Get all courses the student is enrolled in
router.get('/my-courses', protect, getMyCourses);

// Mark a lesson as complete (update progress)
router.put('/progress', protect, markLessonComplete);

module.exports = router;