// lms-backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes (JWT validation)
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse('Not authorized, no token', 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return next(new ErrorResponse('Not authorized, user not found', 401));
        }
        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized, token failed', 401));
    }
});

// Instructor or Admin only
exports.isInstructor = (req, res, next) => {
    if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
        return next();
    }
    return next(new ErrorResponse('Not authorized as instructor', 403));
};

// Admin only
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return next(new ErrorResponse('Not authorized as admin', 403));
}; 