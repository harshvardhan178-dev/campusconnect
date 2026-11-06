import api from './api';

export const userService = {
  getProfile: async (id) => {
    return await api.get(`/users/profile/${id}`);
  },
  updateProfile: async (data) => {
    return await api.put('/users/profile', data);
  },
  uploadAvatar: async (formData) => {
    return await api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  toggleBookmarkOpportunity: async (id) => {
    return await api.post(`/users/bookmarks/opportunity/${id}`);
  },
};

export default userService;
