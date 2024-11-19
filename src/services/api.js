import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTemplates = () => api.get('/templates');
export const getTemplate = (id) => api.get(`/templates/${id}`).then(response => {
  console.log('API response for getTemplate:', response.data);
  return response;
});
export const createTemplate = (data) => api.post('/templates', data);
export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => api.delete(`/templates/${id}`);
export const publishTemplate = (id) => api.post(`/templates/${id}/publish`);

export const createResource = (templateId, data) => api.post(`/templates/${templateId}/resources`, data);
export const updateResource = (id, data) => api.put(`/resources/${id}`, data);
export const deleteResource = (id) => api.delete(`/resources/${id}`);

export const addTag = (templateId, tags) => api.post(`/templates/${templateId}/tags`, { tags });
export const removeTag = (templateId, tag) => api.delete(`/templates/${templateId}/tags/${tag}`);

export const updateResourceConfig = (resourceId, config) => api.put(`/resources/${resourceId}/config`, config);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

export default api;

