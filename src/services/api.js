import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories/list'),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getTracking: (id) => api.get(`/orders/${id}/tracking`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { order_status: status }),
  getAllForAdmin: (params = {}) => api.get('/orders/admin/all', { params }),
};

// Customers API
export const customersAPI = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data) => api.put('/customers/profile', data),
  getOrders: (params = {}) => api.get('/customers/orders', { params }),
  getDashboardStats: () => api.get('/customers/dashboard/stats'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getCustomers: (params = {}) => api.get('/admin/customers', { params }),
  getCustomerDetails: (id) => api.get(`/admin/customers/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { order_status: status }),
  getInventory: (params = {}) => api.get('/admin/inventory', { params }),
  updateInventory: (id, quantity) => api.put(`/admin/inventory/${id}`, { available_quantity: quantity }),
};

// Error handler
export const handleAPIError = (error) => {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

export default api;
