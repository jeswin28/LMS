// lms-backend/controllers/userController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc      Get single user
// @route     GET /api/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }
  const user = await User.findOne({ where: { email: email } });
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  const token = generateToken(user.id);
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// @desc    Admin creates any user
// @route   POST /api/users/admin/create
// @access  Private/Admin
exports.createUserByAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!role || !['student', 'instructor', 'admin'].includes(role)) {
    return next(new ErrorResponse('Invalid role', 400));
  }
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    return next(new ErrorResponse('User already exists', 400));
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  const editable = ['name', 'email', 'phone', 'location', 'bio'];
  for (const key of editable) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      user[key] = req.body[key];
    }
  }
  await user.save();
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// @desc      Update user (by admin)
// @route     PUT /api/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Ensure password is not updated directly via this route unless specifically handled with hashing
  const fieldsToUpdate = { ...req.body };
  delete fieldsToUpdate.password; // Prevent direct password update without hashing

  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user (by admin)
// @route     DELETE /api/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Frontend displays mock users, in a real app, this ensures actual deletion.
  // Note: 'remove()' triggers pre/post hooks. 'deleteOne()'/'deleteMany()' does not.
  await user.deleteOne(); // Or use user.remove() if pre/post hooks are defined for 'remove'

  res.status(200).json({
    success: true,
    data: {},
  });
});