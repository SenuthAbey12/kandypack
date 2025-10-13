import axios from 'axios';
import { mockAuth, mockProducts, mockCustomers, mockAdmin } from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';
const DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Shorter timeout for faster fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and fallback to mock data in development
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (!DEVELOPMENT_MODE) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API calls with fallback to mock data
const apiWithFallback = async (apiCall, mockCall) => {
  if (DEVELOPMENT_MODE) {
    try {
      return await apiCall();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error.message);
      return await mockCall();
    }
  }
  return await apiCall();
};

// Auth API
export const authAPI = {
  register: (userData) => apiWithFallback(
    () => api.post('/auth/register', userData),
    () => mockAuth.register(userData)
  ),
  login: (credentials) => apiWithFallback(
    () => api.post('/auth/login', credentials),
    () => mockAuth.login(credentials)
  ),
  verify: () => apiWithFallback(
    () => api.get('/auth/verify'),
    () => mockAuth.verify()
  ),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};

// Products API
export const productsAPI = {
  // Do NOT fallback to mock for products to avoid showing stale mock items
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => apiWithFallback(
    () => api.get(`/products/${id}`),
    () => Promise.resolve({ data: mockProducts.getAll().then(res => res.data.products.find(p => p.product_id === id)) })
  ),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => apiWithFallback(
    () => api.get('/products/categories/list'),
    () => mockProducts.getCategories()
  )
};

// Orders API
export const ordersAPI = {
  // Important: Do NOT fallback to mock for auth-protected customer data.
  // Returning mock orders can show fake data for new customers.
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getTracking: (id) => api.get(`/orders/${id}/tracking`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { order_status: status }),
  getAllForAdmin: (params = {}) => api.get('/orders/admin/all', { params })
};

// Customers API
export const customersAPI = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (profileData) => api.put('/customers/profile', profileData),
  // Do NOT fallback to mock for customer orders
  getOrders: (params = {}) => api.get('/customers/orders', { params }),
  getDashboardStats: () => apiWithFallback(
    () => api.get('/customers/dashboard/stats'),
    () => mockCustomers.getDashboardStats()
  )
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => apiWithFallback(
    () => api.get('/admin/dashboard/stats'),
    () => mockAdmin.getDashboardStats()
  ),
  getCustomers: (params = {}) => api.get('/admin/customers', { params }),
  getCustomerDetails: (id) => api.get(`/admin/customers/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { order_status: status }),
  getInventory: (params = {}) => api.get('/admin/inventory', { params }),
  updateInventory: (id, quantity) => api.put(`/admin/inventory/${id}`, { available_quantity: quantity })
};

// Generic error handler
export const handleAPIError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

export default api;