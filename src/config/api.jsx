// src/config/api.js
const API_CONFIG = {
  development: {
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  production: {
    baseURL: import.meta.env.VITE_BACKEND_URL || 'https://your-production-backend.com',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000,
  }
};

const environment = import.meta.env.MODE || 'development';

export const BACKEND_CONFIG = {
  ...API_CONFIG[environment],
  endpoints: {
    chat: '/api/chat',
    chatHistory: '/api/chat'
  }
};

export default BACKEND_CONFIG;