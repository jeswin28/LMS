// lms-backend/routes/authRoutes.js
const express = require('express');
const { register, login, getMe, logout, updateDetails, updatePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe); // Get authenticated user's profile
router.put('/updatedetails', protect, updateDetails); // Update user profile details
router.put('/updatepassword', protect, updatePassword); // Update user password
router.post('/forgotpassword', forgotPassword); // Forgot password functionality
router.put('/resetpassword/:resettoken', resetPassword); // Reset password functionality

module.exports = router;