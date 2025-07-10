import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth headers
const createAuthAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });
};

// Dashboard Stats
export const getDashboardStats = async () => {
  const api = createAuthAxios();
  return api.get('/admin/dashboard-stats');
};

// User Management
export const getAllUsers = async () => {
  const api = createAuthAxios();
  return api.get('/admin/users');
};

export const getUserById = async (id) => {
  const api = createAuthAxios();
  return api.get(`/admin/users/${id}`);
};

export const createUser = async (userData) => {
  const api = createAuthAxios();
  return api.post('/admin/users', userData);
};

// Store Management
export const getAllStores = async () => {
  const api = createAuthAxios();
  return api.get('/admin/stores');
};

export const createStore = async (storeData) => {
  const api = createAuthAxios();
  return api.post('/admin/stores', storeData);
};

export const getStoreOwners = async () => {
  const api = createAuthAxios();
  return api.get('/admin/store-owners');
};
