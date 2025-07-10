import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';
import UserModel from './user.model.js';
import Store from './store.model.js';
import Rating from './rating.model.js';

// Initialize models
const User = UserModel(sequelize, DataTypes);

// Set up associations
// User has many stores (as owner) - one-to-one relationship
User.hasOne(Store, { foreignKey: 'ownerId', as: 'ownedStore' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User can rate many stores
User.hasMany(Rating, { foreignKey: 'userId', as: 'userRatings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Store can have many ratings
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

const models = { User, Store, Rating };

// Call associate methods if they exist
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Custom sync function to handle dependencies
const syncDatabase = async (options = {}) => {
  try {
    // Sync models in dependency order
    await User.sync(options);
    await Store.sync(options);
    await Rating.sync(options);
    console.log('All models synced successfully');
    return true;
  } catch (error) {
    console.error('Model sync error:', error);
    throw error;
  }
};

export { sequelize, User, Store, Rating, syncDatabase };
