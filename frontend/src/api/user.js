import api from './auth.js';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/user/update-password', {
      currentPassword,
      newPassword
    });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// Get all stores for browsing
export const getStores = async () => {
  try {
    const response = await api.get('/ratings/stores');
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// Submit a rating for a store
export const submitRating = async (storeId, rating, comment = '') => {
  try {
    const response = await api.post('/ratings/rate', {
      storeId,
      rating,
      comment
    });
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// Get user's ratings
export const getUserRatings = async () => {
  try {
    const response = await api.get('/ratings/my-ratings');
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

const userAPI = {
  getUserProfile,
  updatePassword,
  getStores,
  submitRating,
  getUserRatings
};

export default userAPI;
