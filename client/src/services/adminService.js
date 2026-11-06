import api from './api';

export const adminService = {
  getMetrics: async () => {
    return await api.get('/admin/metrics');
  },
  getUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },
  updateUserStatus: async (id, data) => {
    return await api.patch(`/admin/users/${id}/status`, data);
  },
  deleteContent: async (type, id) => {
    return await api.delete(`/admin/content/${type}/${id}`);
  },
};

export default adminService;
