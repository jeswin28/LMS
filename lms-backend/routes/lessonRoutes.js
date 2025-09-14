const express = require('express');
const {
    addLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
} = require('../controllers/lessonController');
const { protect, isInstructor } = require('../middlewares/authMiddleware');

const router = express.Router();

// Add a lesson to a course (instructor only)
router.post('/courses/:courseId/lessons', protect, isInstructor, addLesson);

// Get a lesson by ID (enrolled student or instructor)
router.get('/lessons/:lessonId', protect, getLessonById);

// Update a lesson (instructor only)
router.put('/lessons/:lessonId', protect, isInstructor, updateLesson);

// Delete a lesson (instructor only)
router.delete('/lessons/:lessonId', protect, isInstructor, deleteLesson);

module.exports = router; 