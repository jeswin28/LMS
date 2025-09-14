// lms-backend/controllers/notificationController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Notification, User } = require('../models');

// @desc      Get all notifications for the authenticated user
// @route     GET /api/notifications
// @access    Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

// @desc      Mark a specific notification as read
// @route     PUT /api/notifications/mark-read/:id
// @access    Private
exports.markNotificationRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findByPk(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id ${req.params.id}`, 404));
  }

  // Ensure user owns the notification or is admin
  if (notification.userId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to mark this notification as read`, 403));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification,
  });
});

// @desc      Mark all notifications as read for the authenticated user
// @route     PUT /api/notifications/mark-all-read
// @access    Private
exports.markAllNotificationsRead = asyncHandler(async (req, res, next) => {
  await Notification.update(
    { read: true },
    { where: { userId: req.user.id, read: false } }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
    data: {},
  });
});

// @desc      Delete a specific notification
// @route     DELETE /api/notifications/delete/:id
// @access    Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findByPk(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id ${req.params.id}`, 404));
  }

  // Ensure user owns the notification or is admin
  if (notification.userId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this notification`, 403));
  }

  await notification.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Delete all notifications for the authenticated user
// @route     DELETE /api/notifications/delete-all
// @access    Private
exports.deleteAllNotifications = asyncHandler(async (req, res, next) => {
  await Notification.destroy({ where: { userId: req.user.id } });

  res.status(200).json({
    success: true,
    message: 'All notifications deleted',
    data: {},
  });
});

// Helper function to create a new notification (used by other controllers)
exports.createNotification = async ({ user, type, title, message, course, relatedEntity }) => {
  try {
    // Find the user to ensure they exist and can receive notifications
    const recipient = await User.findByPk(user);
    if (!recipient) {
      console.warn(`Attempted to create notification for non-existent user: ${user}`);
      return;
    }

    // Check user settings for notifications (e.g., if recipient.emailNotifications is false)
    // For simplicity, we're not filtering deeply here, assuming notifications should always be created internally.
    // Frontend 'SettingsPage' handles user preferences for *receiving* these.

    await Notification.create({
      user: recipient._id,
      type,
      title,
      message,
      course,
      relatedEntity,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};