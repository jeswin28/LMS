// lms-backend/middlewares/roleMiddleware.js
const ErrorResponse = require('../utils/errorResponse');

// Middleware to check if user is admin
exports.requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return next(new ErrorResponse('Access denied. Admin privileges required.', 403));
    }
};

// Middleware to check if user is instructor
exports.requireInstructor = (req, res, next) => {
    if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
        next();
    } else {
        return next(new ErrorResponse('Access denied. Instructor privileges required.', 403));
    }
};

// Middleware to check if user is student
exports.requireStudent = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        return next(new ErrorResponse('Access denied. Student privileges required.', 403));
    }
};

// Middleware to check if user is instructor or admin
exports.requireInstructorOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'instructor' || req.user.role === 'admin')) {
        next();
    } else {
        return next(new ErrorResponse('Access denied. Instructor or admin privileges required.', 403));
    }
}; 