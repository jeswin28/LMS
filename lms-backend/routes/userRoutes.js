// lms-backend/routes/userRoutes.js
const express = require('express');
const {
  loginUser,
  createUserByAdmin,
  getUserProfile,
  updateUserProfile,
  getUsers,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public login
router.post('/login', loginUser);

// Admin-only user creation
router.post('/admin/create', protect, isAdmin, createUserByAdmin);

// Get current user profile
router.get('/profile', protect, getUserProfile);

// Update current user profile
router.put('/me', protect, updateUserProfile);

// Get all users (admin only)
router.get('/', protect, isAdmin, getUsers);

module.exports = router;