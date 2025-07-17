// src/config/axios.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { toast } from 'sonner';

let ip = window.location.hostname;
let port = 8000;
const API_BASE_URL = `http://127.0.0.1:${port}`;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },
  
  getTokenExpiry: (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  }
};

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();
    
    if (token) {
      // Check if token is expired before making request
      if (tokenManager.isTokenExpired(token)) {
        tokenManager.removeToken();
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration and network errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response, message } = error;
    
    // Handle different error scenarios
    if (response) {
      const { status } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          tokenManager.removeToken();
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          toast.error('Access denied. You don\'t have permission to perform this action.');
          break;
          
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation error
          const validationErrors = response.data?.errors || response.data?.message;
          if (typeof validationErrors === 'string') {
            toast.error(validationErrors);
          } else if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err: string) => toast.error(err));
          } else {
            toast.error('Validation failed. Please check your input.');
          }
          break;
          
        case 429:
          // Rate limit exceeded
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          toast.error(response.data?.message || 'An unexpected error occurred.');
      }
    } else if (message === 'Network Error') {
      // Network error
      toast.error('Network error. Please check your connection and try again.');
    } else if (message.includes('timeout')) {
      // Request timeout
      toast.error('Request timeout. Please try again.');
    } else {
      // Other errors
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/api/login', { email, password }),
    
    me: () => apiClient.get('/api/me'),
    
    logout: () => apiClient.post('/auth/logout'),
    
    refreshToken: () => apiClient.post('/auth/refresh'),
  },
  
  // Add other API endpoints here as needed
  projects: {
    list: () => apiClient.get('/projects'),
    create: (data: any) => apiClient.post('/projects', data),
    update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
    delete: (id: string) => apiClient.delete(`/projects/${id}`),
  },
};

// Export the configured axios instance
export default apiClient;

// Helper function for handling API errors in components
export const handleApiError = (error: any, defaultMessage = 'An error occurred') => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMessage;
};