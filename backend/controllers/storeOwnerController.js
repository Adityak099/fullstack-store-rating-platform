import { User, Store, Rating } from '../models/index.js';
import { error as _error, success } from '../utils/apiResponse.js';
import { sequelize } from '../config/db.config.js';

// Get store owner's store and statistics
export const getStoreOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the store owned by this user
    const store = await Store.findOne({
      where: { ownerId: userId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!store) {
      return success(res, {
        hasStore: false,
        message: 'No store found. Please create a store first.'
      }, 'Dashboard data retrieved');
    }

    // Calculate average rating
    const averageRating = store.ratings.length > 0 
      ? (store.ratings.reduce((sum, rating) => sum + rating.rating, 0) / store.ratings.length).toFixed(1)
      : 0;

    // Get rating distribution
    const ratingDistribution = {
      5: store.ratings.filter(r => r.rating === 5).length,
      4: store.ratings.filter(r => r.rating === 4).length,
      3: store.ratings.filter(r => r.rating === 3).length,
      2: store.ratings.filter(r => r.rating === 2).length,
      1: store.ratings.filter(r => r.rating === 1).length,
    };

    // Format user ratings for display
    const userRatings = store.ratings.map(rating => ({
      id: rating.id,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
      user: {
        id: rating.user.id,
        name: rating.user.name,
        email: rating.user.email
      }
    }));

    const dashboardData = {
      hasStore: true,
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        category: store.category,
        isActive: store.isActive
      },
      statistics: {
        totalRatings: store.ratings.length,
        averageRating: parseFloat(averageRating),
        ratingDistribution
      },
      userRatings: userRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    };

    return success(res, dashboardData, 'Dashboard data retrieved successfully');
  } catch (error) {
    console.error('Dashboard error:', error);
    return _error(res, error.message);
  }
};

// Create a new store for the store owner
export const createStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, address, phone, category } = req.body;

    // Check if user already has a store
    const existingStore = await Store.findOne({ where: { ownerId: userId } });
    if (existingStore) {
      return _error(res, 'You already have a store. Each user can only own one store.', 400);
    }

    // Create the store
    const store = await Store.create({
      name,
      description,
      address,
      phone,
      category,
      ownerId: userId
    });

    return success(res, { store }, 'Store created successfully', 201);
  } catch (error) {
    return _error(res, error.message);
  }
};

// Update store information
export const updateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, address, phone, category } = req.body;

    const store = await Store.findOne({ where: { ownerId: userId } });
    if (!store) {
      return _error(res, 'Store not found', 404);
    }

    await store.update({
      name: name || store.name,
      description: description || store.description,
      address: address || store.address,
      phone: phone || store.phone,
      category: category || store.category
    });

    return success(res, { store }, 'Store updated successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get detailed rating analytics
export const getRatingAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const store = await Store.findOne({
      where: { ownerId: userId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!store) {
      return _error(res, 'Store not found', 404);
    }

    // Monthly rating trends (last 6 months)
    const monthlyRatings = await Rating.findAll({
      where: { storeId: store.id },
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    const analytics = {
      monthlyTrends: monthlyRatings,
      totalRatings: store.ratings.length,
      averageRating: store.ratings.length > 0 
        ? (store.ratings.reduce((sum, rating) => sum + rating.rating, 0) / store.ratings.length).toFixed(1)
        : 0
    };

    return success(res, analytics, 'Analytics retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};
