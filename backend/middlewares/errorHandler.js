import { error } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => e.message);
        return error(res, errors.join(', '), 400);
    }

    // Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        return error(res, 'Resource already exists', 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return error(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return error(res, 'Token expired', 401);
    }

    // Default error
    return error(res, err.message || 'Internal Server Error', err.statusCode || 500);
};
