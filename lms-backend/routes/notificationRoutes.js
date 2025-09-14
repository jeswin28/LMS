// lms-backend/routes/notificationRoutes.js
const express = require('express');
const { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, deleteAllNotifications } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All notification routes require authentication

router.route('/')
  .get(getNotifications); // Get all notifications for the authenticated user

router.route('/mark-read/:id')
  .put(markNotificationRead); // Mark a specific notification as read

router.route('/mark-all-read')
  .put(markAllNotificationsRead); // Mark all notifications as read

router.route('/delete/:id')
  .delete(deleteNotification); // Delete a specific notification

router.route('/delete-all')
  .delete(deleteAllNotifications); // Delete all notifications

module.exports = router;