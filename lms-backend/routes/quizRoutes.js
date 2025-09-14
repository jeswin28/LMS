// lms-backend/routes/quizRoutes.js
const express = require('express');
const { createQuiz, addQuestion, submitQuiz, getQuizAttempts } = require('../controllers/quizController');
const { protect, isInstructor } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/courses/:courseId/quizzes', protect, isInstructor, createQuiz);
router.post('/quizzes/:quizId/questions', protect, isInstructor, addQuestion);
router.post('/quizzes/:quizId/submit', protect, submitQuiz); // Student only (checked in controller)
router.get('/quizzes/:quizId/attempts', protect, isInstructor, getQuizAttempts);

module.exports = router;