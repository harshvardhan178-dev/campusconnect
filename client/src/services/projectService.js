import api from './api';

export const projectService = {
  getAll: async (params = {}) => {
    return await api.get('/projects', { params });
  },
  getById: async (id) => {
    return await api.get(`/projects/${id}`);
  },
  create: async (data) => {
    return await api.post('/projects', data);
  },
  update: async (id, data) => {
    return await api.put(`/projects/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/projects/${id}`);
  },
  toggleLike: async (id) => {
    return await api.post(`/projects/${id}/like`);
  },
};

export default projectService;
