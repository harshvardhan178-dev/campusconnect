const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiException = require('../exceptions/ApiException');

/**
 * Protect routes - Authenticate JWT token in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiException.unauthorized('Not authorized to access this route. Token missing.'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026'
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(ApiException.unauthorized('User associated with this token no longer exists.'));
    }

    if (!user.isActive) {
      return next(ApiException.forbidden('This account has been deactivated by an administrator.'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(ApiException.unauthorized('Invalid or expired authentication token.'));
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * @param  {...string} roles Allowed roles ('student', 'organizer', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiException.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiException.forbidden(
          `User role '${req.user.role}' is not authorized to perform this action.`
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
