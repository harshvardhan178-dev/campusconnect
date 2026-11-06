import api from './api';

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  getMe: async () => {
    return await api.get('/auth/me');
  },
  logout: () => {
    localStorage.removeItem('campusconnect_token');
    localStorage.removeItem('campusconnect_user');
  },
};

export default authService;
