import { User, Store, Rating } from '../models/index.js';
import { error as _error, success } from '../utils/apiResponse.js';
import bcrypt from 'bcryptjs';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    return success(res, { users, count: users.length }, 'Users retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role', 'address', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Store,
          as: 'ownedStore',
          required: false,
          attributes: ['id', 'name', 'description', 'address', 'phone', 'category', 'isActive'],
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: ['rating']
            }
          ]
        }
      ]
    });

    if (!user) {
      return _error(res, 'User not found', 404);
    }

    // Calculate store rating if user is a store owner
    let userWithStore = user.toJSON();
    if (userWithStore.ownedStore && userWithStore.ownedStore.ratings) {
      const averageRating = userWithStore.ownedStore.ratings.length > 0 
        ? (userWithStore.ownedStore.ratings.reduce((sum, rating) => sum + rating.rating, 0) / userWithStore.ownedStore.ratings.length).toFixed(1)
        : 0;
      
      userWithStore.ownedStore.averageRating = parseFloat(averageRating);
      userWithStore.ownedStore.totalRatings = userWithStore.ownedStore.ratings.length;
      delete userWithStore.ownedStore.ratings; // Remove ratings array from response
    }

    return success(res, { user: userWithStore }, 'User retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get dashboard stats (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    
    const usersByRole = await User.findAll({
      attributes: ['role', [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']],
      group: ['role'],
      raw: true
    });

    const recentUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const recentStores = await Store.findAll({
      attributes: ['id', 'name', 'createdAt'],
      include: [{
        model: User,
        as: 'owner',
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const stats = {
      totalUsers,
      totalStores,
      totalRatings,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = parseInt(curr.count);
        return acc;
      }, {}),
      recentUsers,
      recentStores
    };

    return success(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Create new user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return _error(res, 'Name, email, password, and role are required', 400);
    }

    if (!['admin', 'user', 'store_owner'].includes(role)) {
      return _error(res, 'Invalid role. Must be admin, user, or store_owner', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return _error(res, 'User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address: address || null,
      role
    });

    // Return user without password
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      address: newUser.address,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return success(res, { user: userResponse }, 'User created successfully', 201);
  } catch (error) {
    return _error(res, error.message);
  }
};

// Create new store (Admin only)
export const createStore = async (req, res) => {
  try {
    const { name, description, address, phone, category, ownerId } = req.body;

    // Validate input
    if (!name || !ownerId) {
      return _error(res, 'Store name and owner ID are required', 400);
    }

    // Check if owner exists and is a store_owner
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return _error(res, 'Owner not found', 404);
    }

    if (owner.role !== 'store_owner') {
      return _error(res, 'Selected user is not a store owner', 400);
    }

    // Check if owner already has a store
    const existingStore = await Store.findOne({ where: { ownerId } });
    if (existingStore) {
      return _error(res, 'This store owner already has a store', 400);
    }

    // Create store
    const newStore = await Store.create({
      name,
      description: description || null,
      address: address || null,
      phone: phone || null,
      category: category || null,
      ownerId,
      isActive: true
    });

    // Return store with owner info
    const storeWithOwner = await Store.findByPk(newStore.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });

    return success(res, { store: storeWithOwner }, 'Store created successfully', 201);
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get all stores (Admin only)
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'address']
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating']
        }
      ],
      order: [['createdAt', 'DESC']]
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
        isActive: store.isActive,
        owner: store.owner,
        averageRating: parseFloat(averageRating),
        totalRatings: store.ratings.length,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt
      };
    });

    return success(res, { stores: storesWithRatings, count: storesWithRatings.length }, 'Stores retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};

// Get store owners for dropdown
export const getStoreOwners = async (req, res) => {
  try {
    const storeOwners = await User.findAll({
      where: { role: 'store_owner' },
      attributes: ['id', 'name', 'email'],
      include: [{
        model: Store,
        as: 'ownedStore',
        required: false,
        attributes: ['id']
      }],
      order: [['name', 'ASC']]
    });

    // Filter out store owners who already have a store
    const availableOwners = storeOwners.filter(owner => !owner.ownedStore);

    return success(res, { storeOwners: availableOwners }, 'Store owners retrieved successfully');
  } catch (error) {
    return _error(res, error.message);
  }
};
