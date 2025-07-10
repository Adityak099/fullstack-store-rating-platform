import jwt from 'jsonwebtoken';
import { error as _error } from '../utils/apiResponse.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return _error(res, 'Access token required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return _error(res, 'Invalid or expired token', 403);
  }
};

// Middleware to check user role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return _error(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return _error(res, 'Insufficient permissions', 403);
    }

    next();
  };
};
