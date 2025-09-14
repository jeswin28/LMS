// lms-backend/routes/discussionRoutes.js
const express = require('express');
const { createDiscussionPost, getCourseDiscussions, addComment } = require('../controllers/discussionController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/courses/:courseId/discussions', protect, createDiscussionPost);
router.get('/courses/:courseId/discussions', protect, getCourseDiscussions);
router.post('/discussions/:postId/comments', protect, addComment);

module.exports = router;