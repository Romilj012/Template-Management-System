import axios from 'axios';

const LOCAL_API_URL = 'http://localhost:8000';
const PRODUCTION_API_URL = 'https://dev.test.neuralix.ai/api';
const API_KEY = '';

const localApi = axios.create({
  baseURL: LOCAL_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const productionApi = axios.create({
  baseURL: PRODUCTION_API_URL,
  headers: { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY },
});

export const setAuthToken = (token) => {
  localApi.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : null;
};

export const login = async (email, password) => {
  const response = await localApi.post('/token', new URLSearchParams({ username: email, password }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  setAuthToken(response.data.access_token);
  return response.data;
};

export const signup = async (name, email, password) => {
  return (await localApi.post('/signup', { name, email, password })).data;
};

export const getCurrentUser = async () => {
  return (await localApi.get('/users/me')).data;
};

export const getUserTemplates = async () => {
  return (await localApi.get('/users/me/templates')).data;
};

export const createUserTemplate = async (templateData) => {
  return (await localApi.post('/users/me/templates', templateData)).data;
};

export const getTemplates = () => localApi.get('/templates');
export const getTemplate = (id) => localApi.get(`/templates/${id}`);
export const createTemplate = (data) => localApi.post('/templates', data);
export const updateTemplate = (id, data) => localApi.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => localApi.delete(`/templates/${id}`);

export const createResource = (templateId, data) => localApi.post(`/templates/${templateId}/resources`, data);
export const updateResource = (id, data) => localApi.put(`/resources/${id}`, data);
export const deleteResource = (id) => localApi.delete(`/resources/${id}`);

export const exportTemplate = (id) => localApi.get(`/templates/${id}/export`, { responseType: 'blob' });
export const importTemplate = (formData) => localApi.post('/templates/import', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});


export const getSuggestions = async (context) => {
  return (await axios.post(`${LOCAL_API_URL}/llm/suggestions/`, context)).data;
};

export const getTemplateVersions = (templateId) => localApi.get(`/templates/${templateId}/versions`);
export const getTemplateDiff = (templateId, version1, version2) => 
  localApi.get(`/templates/${templateId}/diff`, { params: { version1, version2 } });


  export const publishTemplate = async (templateId, xNixWid = null) => {
    try {
      const templateResponse = await getTemplate(templateId);
      const template = templateResponse.data;
      const formData = new FormData();
      const templatePackage = {
        id: templateId,
        displayName: template.displayName,
        description: template.description,
        tags: template.tags,
        resources: template.resources.map(resource => ({
          displayName: resource.displayName,
          type: resource.type,
          config: resource.config
        }))
      };
  
      const templateBlob = new Blob([JSON.stringify(templatePackage)], {
        type: 'application/json'
      });
      formData.append('file', templateBlob, `${templateId}.nixdlt`);
  
      const response = await localApi.post(`/templates/${templateId}/publish`, formData, {
        headers: {
          ...(xNixWid && { 'x-nix-wid': xNixWid.toString() })
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };