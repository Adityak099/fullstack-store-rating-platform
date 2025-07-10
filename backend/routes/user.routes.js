import { Router } from 'express';
import { getAllUsers, getUserDashboard, updatePassword, getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

// Get all users (public endpoint for testing)
router.get('/all', getAllUsers);

// Protected routes - require authentication
router.get('/profile', authenticateToken, getUserProfile);
router.put('/update-password', authenticateToken, updatePassword);

// User dashboard
router.get('/dashboard', getUserDashboard);

export default router;
