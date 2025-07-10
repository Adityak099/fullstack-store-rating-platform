import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.js';
import { 
  getAllUsers, 
  getUserById, 
  getDashboardStats, 
  createUser, 
  createStore, 
  getAllStores, 
  getStoreOwners 
} from '../controllers/adminController.js';

const router = Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Admin dashboard stats
router.get('/dashboard-stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);

// Store management
router.get('/stores', getAllStores);
router.post('/stores', createStore);
router.get('/store-owners', getStoreOwners);

export default router;
