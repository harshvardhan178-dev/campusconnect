import axios from 'axios';

/**
 * Pre-configured Axios instance for CampusConnect
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error response formatting
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // If token expired or unauthorized, clean local token & trigger event if needed
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('campusconnect_token');
      localStorage.removeItem('campusconnect_user');
    }

    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'An unexpected network error occurred';

    return Promise.reject({
      statusCode: error.response?.status || 500,
      message,
      errors: error.response?.data?.errors || [],
    });
  }
);

export default api;
