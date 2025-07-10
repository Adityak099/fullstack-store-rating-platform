import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import storeOwnerRoutes from './routes/storeOwner.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(json());

// Debug: Log all routes
console.log('Mounting routes...');

// Routes
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes mounted at /api/auth');

app.use('/api/admin', adminRoutes);
console.log('✓ Admin routes mounted at /api/admin');

app.use('/api/user', userRoutes);
console.log('✓ User routes mounted at /api/user');

app.use('/api/store-owner', storeOwnerRoutes);
console.log('✓ Store owner routes mounted at /api/store-owner');

app.use('/api/ratings', ratingRoutes);
console.log('✓ Rating routes mounted at /api/ratings');

// Add a test route to verify the server is working
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is working' });
});

// Error handling
app.use(errorHandler);

export default app;
export const listen = app.listen.bind(app);