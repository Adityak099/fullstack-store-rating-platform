import { User } from '../models/index.js';
import { error as _error, success } from '../utils/apiResponse.js';
import bcrypt from 'bcryptjs';

// Get all users (public endpoint for testing)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return success(res, { users, count: users.length }, 'Users retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get user dashboard (placeholder)
export const getUserDashboard = async (req, res) => {
  try {
    return success(res, { message: 'User dashboard - Coming soon' }, 'Dashboard loaded');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Update user password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Validate input
    if (!currentPassword || !newPassword) {
      return _error(res, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return _error(res, 'New password must be at least 6 characters long', 400);
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return _error(res, 'User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return _error(res, 'Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedNewPassword });

    return success(res, null, 'Password updated successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'address', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return _error(res, 'User not found', 404);
    }

    return success(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};
