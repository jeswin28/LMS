// lms-backend/routes/courseRoutes.js
const express = require('express');
const {
  createCourse,
  getCourses,
  getPendingCourses,
  approveCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getMyCourses,
} = require('../controllers/courseController');
const { protect, isInstructor, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new course (instructor only)
router.post('/', protect, isInstructor, createCourse);

// Get all approved courses (public)
router.get('/', getCourses);

// Get instructor's courses (instructor only)
router.get('/my-courses', protect, isInstructor, getMyCourses);

// Get all pending courses (admin only)
router.get('/admin/pending', protect, isAdmin, getPendingCourses);

// Approve a course (admin only)
router.put('/:id/approve', protect, isAdmin, approveCourse);

// Get a single course by ID (public)
router.get('/:id', getCourseById);

// Update a course (instructor/owner or admin)
router.put('/:id', protect, isInstructor, updateCourse);

// Delete a course (instructor/owner or admin)
router.delete('/:id', protect, isInstructor, deleteCourse);

module.exports = router;