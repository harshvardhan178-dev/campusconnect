import api from './api';

export const opportunityService = {
  getAll: async (params = {}) => {
    return await api.get('/opportunities', { params });
  },
  getById: async (id) => {
    return await api.get(`/opportunities/${id}`);
  },
  create: async (data) => {
    return await api.post('/opportunities', data);
  },
  update: async (id, data) => {
    return await api.put(`/opportunities/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/opportunities/${id}`);
  },
  apply: async (id, applicationData) => {
    return await api.post(`/opportunities/${id}/apply`, applicationData);
  },
  getApplications: async (id) => {
    return await api.get(`/opportunities/${id}/applications`);
  },
  updateApplicationStatus: async (applicationId, status, reviewerFeedback) => {
    return await api.patch(`/applications/${applicationId}/status`, { status, reviewerFeedback });
  },
  getMyApplications: async () => {
    return await api.get('/applications/my');
  },
};

export default opportunityService;
