import api from './auth.js';

// Store Owner API functions
export const getStoreOwnerDashboard = async () => {
  try {
    const response = await api.get('/store-owner/dashboard');
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

export const createStore = async (storeData) => {
  try {
    const response = await api.post('/store-owner/store', storeData);
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

export const updateStore = async (storeData) => {
  try {
    const response = await api.put('/store-owner/store', storeData);
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

export const getRatingAnalytics = async () => {
  try {
    const response = await api.get('/store-owner/analytics');
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// Rating API functions
export const getAllStores = async () => {
  try {
    const response = await api.get('/ratings/stores');
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

export const rateStore = async (storeId, rating, comment) => {
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

export const getUserRatings = async () => {
  try {
    const response = await api.get('/ratings/my-ratings');
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

const storeOwnerAPI = {
  getStoreOwnerDashboard,
  createStore,
  updateStore,
  getRatingAnalytics,
  getAllStores,
  rateStore,
  getUserRatings
};

export default storeOwnerAPI;
