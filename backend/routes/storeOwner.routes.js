import { Router } from 'express';
import { 
  getStoreOwnerDashboard, 
  createStore, 
  updateStore, 
  getRatingAnalytics 
} from '../controllers/storeOwnerController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = Router();

// All routes require authentication and store_owner role
router.use(authenticateToken);
router.use(requireRole(['store_owner']));

// Store owner dashboard with ratings and statistics
router.get('/dashboard', getStoreOwnerDashboard);

// Store management
router.post('/store', createStore);
router.put('/store', updateStore);

// Rating analytics
router.get('/analytics', getRatingAnalytics);

export default router;
