import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 20000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (payload) => API.post('/auth/register', payload),
  login: (payload) => API.post('/auth/login', payload),
  me: () => API.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (data) => API.put('/user/profile', data),
};

export const dashboardAPI = {
  get: () => API.get('/dashboard'),
  sync: () => API.post('/transactions/sync'),
};

export const accountsAPI = {
  getAll: () => API.get('/accounts'),
  create: (payload) => API.post('/accounts', payload),
  update: (id, payload) => API.put(`/accounts/${id}`, payload),
  remove: (id) => API.delete(`/accounts/${id}`),
};

export const transactionsAPI = {
  getAll: (params) => API.get('/transactions', { params }),
  create: (payload) => API.post('/transactions', payload),
  update: (id, payload) => API.put(`/transactions/${id}`, payload),
  remove: (id) => API.delete(`/transactions/${id}`),
  importCsv: (payload) => API.post('/transactions/import/csv', payload),
  importSms: (payload) => API.post('/transactions/import/sms', payload),
};

export const investmentsAPI = {
  getAll: () => API.get('/investments'),
};

export default API;
