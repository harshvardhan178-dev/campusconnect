import api from './api';

export const teamService = {
  getAll: async (params = {}) => {
    return await api.get('/teams', { params });
  },
  getById: async (id) => {
    return await api.get(`/teams/${id}`);
  },
  create: async (data) => {
    return await api.post('/teams', data);
  },
  update: async (id, data) => {
    return await api.put(`/teams/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/teams/${id}`);
  },
  sendRequest: async (teamId, message) => {
    return await api.post(`/teams/${teamId}/requests`, { message });
  },
  getRequests: async (teamId) => {
    return await api.get(`/teams/${teamId}/requests`);
  },
  manageRequest: async (requestId, status) => {
    return await api.patch(`/requests/${requestId}`, { status });
  },
};

export default teamService;
