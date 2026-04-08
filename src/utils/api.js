// src/utils/api.js
import axios from 'axios';

// Use absolute URL to your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-finance-tracker.onrender.com/api';

console.log('🔧 API Base URL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for Render spin-up
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Always set Content-Type for POST requests
  if (config.method === 'post' || config.method === 'put') {
    config.headers['Content-Type'] = 'application/json';
  }

  console.log('🚀 Making API request to:', `${config.baseURL}${config.url}`);
  console.log('📦 Request data:', config.data);

  return config;
});

// Handle responses
API.interceptors.response.use(
  (response) => {
    console.log('✅ API response success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (email, password, name) => API.post('/auth/register', { email, password, name }),
};

export const accountsAPI = {
  create: (data) => API.post('/accounts', data),
  getAll: () => API.get('/accounts'),
};

// In your api.js - add this to transactionsAPI
export const transactionsAPI = {
  create: (data) => {
    console.log('📤 Sending transaction data to API:', data);
    return API.post('/transactions', data);
  },
  getAll: (params = {}) => API.get('/transactions', { params }),
  getById: (id) => API.get(`/transactions/${id}`),
  update: (id, data) => API.put(`/transactions/${id}`, data),
  delete: (id) => API.delete(`/transactions/${id}`),
};

export const dashboardAPI = {
  getData: () => API.get('/dashboard'),
};

export default API;
