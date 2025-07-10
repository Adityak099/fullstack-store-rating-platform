import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'storeId'] // One rating per user per store
    }
  ]
});

export default Rating;
