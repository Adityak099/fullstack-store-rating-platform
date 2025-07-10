import { Router } from 'express';
import { getAllStores, rateStore, getUserRatings } from '../controllers/ratingController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/stores', getAllStores);

// Protected routes
router.post('/rate', authenticateToken, rateStore);
router.get('/my-ratings', authenticateToken, getUserRatings);

export default router;
