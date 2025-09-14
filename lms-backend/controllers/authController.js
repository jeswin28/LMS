// lms-backend/controllers/authController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { User } = require('../models');
const sendTokenResponse = require('../utils/sendTokenResponse');
const crypto = require('crypto');

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Only allow instructor registration via public route
  if (role !== 'instructor') {
    return next(new ErrorResponse('Only instructors can self-register. Students must be created by an admin.', 403));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 201, res);
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body; // Frontend sends role in login as well

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if role matches
  if (user.role !== role) {
    return next(new ErrorResponse(`User is not a ${role}`, 403));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id); // req.user is set by protect middleware

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user details
// @route     PUT /api/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    bio: req.body.bio,
    dateOfBirth: req.body.dateOfBirth,
    linkedIn: req.body.linkedIn,
    github: req.body.github,
    website: req.body.website,
    profileVisibility: req.body.profileVisibility,
    showProgress: req.body.showProgress,
    showAchievements: req.body.showAchievements,
    allowMessages: req.body.allowMessages,
    // avatar: req.body.avatar, // Handled separately if file upload
  };

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  await user.update(fieldsToUpdate);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user password
// @route     PUT /api/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  // Check if current password matches
  if (!user || !(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  await user.update({ password: req.body.newPassword }); // Pre-save hook will hash the new password

  sendTokenResponse(user, 200, res); // Send new token as password changed
});

// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return next(new ErrorResponse(`There is no user with that email`, 404));
  }

  // Get reset token (simplified, in real app, send email with token)
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.update({
    resetPasswordToken: crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex'),
    resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });

  // In a real application, you would send an email with a link like:
  // const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
  // await sendEmail({ to: user.email, subject: 'Password Reset Token', text: resetUrl });

  res.status(200).json({
    success: true,
    data: 'Reset token sent to email (for demo, token is: ' + resetToken + ')', // For demo purposes
  });
});

// @desc      Reset password
// @route     PUT /api/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { [require('sequelize').Op.gt]: new Date() }
    }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token or token expired', 400));
  }

  await user.update({
    password: req.body.password,
    resetPasswordToken: null,
    resetPasswordExpire: null
  }); // Pre-save hook will hash the new password

  sendTokenResponse(user, 200, res);
});