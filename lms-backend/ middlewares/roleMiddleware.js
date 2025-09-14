// lms-backend/middlewares/roleMiddleware.js
// This middleware is conceptually similar to `authorize` in authMiddleware.js.
// It's kept separate for clarity if more complex role checks were needed,
// but for this project, `authMiddleware.authorize` is sufficient.
// For now, it will simply re-export or apply the same logic.

const ErrorResponse = require('../utils/errorResponse');

exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user ? req.user.role : 'unauthenticated'} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};