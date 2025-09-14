// lms-backend/routes/adminRoutes.js
const express = require('express');
const { getPendingApprovals, approveItem, rejectItem, getPlatformAnalytics, contactSupport } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, isAdmin);

// Approvals
router.route('/approvals')
  .get(getPendingApprovals); // Get all pending items for approval

router.route('/approvals/:id/approve')
  .put(approveItem); // Approve an item (course, instructor, content)

router.route('/approvals/:id/reject')
  .put(rejectItem); // Reject an item

// Analytics
router.route('/analytics')
  .get(getPlatformAnalytics); // Get platform-wide analytics

// Support Contact (Admin might manage support tickets)
router.route('/support')
  .post(contactSupport); // Admin can also use this for internal messages or triggering support emails

module.exports = router;