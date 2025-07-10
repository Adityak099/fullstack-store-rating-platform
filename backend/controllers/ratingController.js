import { User, Store, Rating } from '../models/index.js';
import { error as _error, success } from '../utils/apiResponse.js';

// Get all stores for users to browse
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name']
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating']
        }
      ]
    });

    // Calculate average rating for each store
    const storesWithRatings = stores.map(store => {
      const averageRating = store.ratings.length > 0 
        ? (store.ratings.reduce((sum, rating) => sum + rating.rating, 0) / store.ratings.length).toFixed(1)
        : 0;

      return {
        id: store.id,
        name: store.name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        category: store.category,
        owner: store.owner,
        averageRating: parseFloat(averageRating),
        totalRatings: store.ratings.length
      };
    });

    return success(res, { stores: storesWithRatings }, 'Stores retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Rate a store
export const rateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return _error(res, 'Rating must be between 1 and 5', 400);
    }

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return _error(res, 'Store not found', 404);
    }

    // Check if user is trying to rate their own store
    if (store.ownerId === userId) {
      return _error(res, 'You cannot rate your own store', 400);
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { userId, storeId }
    });

    if (existingRating) {
      // Update existing rating
      await existingRating.update({ rating, comment });
      return success(res, { rating: existingRating }, 'Rating updated successfully');
    } else {
      // Create new rating
      const newRating = await Rating.create({
        userId,
        storeId,
        rating,
        comment
      });
      return success(res, { rating: newRating }, 'Rating submitted successfully', 201);
    }
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get user's ratings
export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return success(res, { ratings }, 'User ratings retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};
