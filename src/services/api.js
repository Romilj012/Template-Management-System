// //working 11/19 10:55
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const getTemplates = () => api.get('/templates');
// export const getTemplate = (id) => api.get(`/templates/${id}`).then(response => {
//   console.log('API response for getTemplate:', response.data);
//   return response;
// });
// export const createTemplate = (data) => api.post('/templates', data);
// export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data);
// export const deleteTemplate = (id) => api.delete(`/templates/${id}`);
// export const publishTemplate = (id) => api.post(`/templates/${id}/publish`);

// export const createResource = (templateId, data) => api.post(`/templates/${templateId}/resources`, data);
// export const updateResource = (id, data) => api.put(`/resources/${id}`, data);
// export const deleteResource = (id) => api.delete(`/resources/${id}`);

// export const addTag = (templateId, tags) => api.post(`/templates/${templateId}/tags`, { tags });
// export const removeTag = (templateId, tag) => api.delete(`/templates/${templateId}/tags/${tag}`);

// export const updateResourceConfig = (resourceId, config) => api.put(`/resources/${resourceId}/config`, config);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response);
//     return Promise.reject(error);
//   }
// );

// export default api;

//11/20 3:14
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// export const getTemplates = () => api.get('/templates');
// export const getTemplate = (id) => api.get(`/templates/${id}`).then(response => {
//   console.log('API response for getTemplate:', response.data);
//   return response;
// });
// export const createTemplate = (data) => api.post('/templates', data);
// export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data);
// export const deleteTemplate = (id) => api.delete(`/templates/${id}`);
// export const publishTemplate = (id) => api.post(`/templates/${id}/publish`);

// export const createResource = (templateId, data) => api.post(`/templates/${templateId}/resources`, data);
// export const updateResource = (id, data) => api.put(`/resources/${id}`, data);
// export const deleteResource = (id) => api.delete(`/resources/${id}`);

// export const addTag = (templateId, tags) => api.post(`/templates/${templateId}/tags`, { tags });
// export const removeTag = (templateId, tag) => api.delete(`/templates/${templateId}/tags/${tag}`);

// export const updateResourceConfig = (resourceId, config) => api.put(`/resources/${resourceId}/config`, config);



// export const importTemplate = async (formData) => {
//   try {
//     const response = await api.post('/templates/import', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Import template error:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// export const exportTemplate = (templateId) => 
//   api.get(`/templates/${templateId}/export`, { responseType: 'blob' });

//   api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       console.error('API Error:', error.response);
//       return Promise.reject(error);
//     }
//   );

// export default api;


// import axios from 'axios';

// const LOCAL_API_URL = 'http://localhost:8000';
// const PRODUCTION_API_URL = 'https://dev.test.neuralix.ai/workspaces/api';

// const localApi = axios.create({
//   baseURL: LOCAL_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// const productionApi = axios.create({
//   baseURL: PRODUCTION_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Api-Key': 'nixdlt_f4d47a72fdbc6784341de64885b2bdc20f6237e05ff708e1f2671d143a108600',
//   },
// });

// export const getTemplates = () => localApi.get('/templates');
// export const getTemplate = (id) => localApi.get(`/templates/${id}`);
// export const createTemplate = (data) => localApi.post('/templates', data);
// export const updateTemplate = (id, data) => localApi.put(`/templates/${id}`, data);
// export const deleteTemplate = (id) => localApi.delete(`/templates/${id}`);
// export const createResource = (templateId, data) => localApi.post(`/templates/${templateId}/resources`, data);
// export const updateResource = (id, data) => localApi.put(`/resources/${id}`, data);
// export const deleteResource = (id) => localApi.delete(`/resources/${id}`);
// export const exportTemplate = (id) => localApi.get(`/templates/${id}/export`, { responseType: 'blob' });
// export const importTemplate = (formData) => localApi.post('/templates/import', formData, {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// });
// // export const publishTemplate = (templateId, templateName) => {
// //   const formData = new FormData();
// //   const fileContent = JSON.stringify({
// //       template_id: templateId,
// //       key_name: templateName
// //   });
// //   const file = new Blob([fileContent], {
// //       type: 'application/json'
// //   });
// //   formData.append('file', file, 'template.json');
// //   return productionApi.post('/usecases', formData, {
// //       headers: {
// //           'Content-Type': 'multipart/form-data',
// //       },
// //   });
// // };

// export const publishTemplate = async (templateData) => {
//   const formData = new FormData();
//   formData.append('file', new Blob([JSON.stringify(templateData)], {type: 'application/json'}));

//   const response = await fetch('https://dev.test.neuralix.ai/api/usecases', {
//     method: 'POST',
//     body: formData,
//     headers: {
//       'x-nix-wid': localStorage.getItem('workspaceId') // Assuming you store the workspace ID in localStorage
//     }
//   });

//   if (!response.ok) {
//     throw new Error('Failed to publish template');
//   }

//   return response.json();
// };


//working 11/22 5:07
import axios from 'axios';

const LOCAL_API_URL = 'http://localhost:8000';
const PRODUCTION_API_URL = 'https://dev.test.neuralix.ai/api/workspaces';

const localApi = axios.create({
  baseURL: LOCAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productionApi = axios.create({
  baseURL: PRODUCTION_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': '',
  },
});

export const getTemplates = () => localApi.get('/templates');
export const getTemplate = (id) => localApi.get(`/templates/${id}`);
export const deleteTemplate = (id) => localApi.delete(`/templates/${id}`);
export const createResource = (templateId, data) => localApi.post(`/templates/${templateId}/resources`, data);
export const updateResource = (id, data) => localApi.put(`/resources/${id}`, data);
export const deleteResource = (id) => localApi.delete(`/resources/${id}`);
export const exportTemplate = (id) => localApi.get(`/templates/${id}/export`, { responseType: 'blob' });
export const importTemplate = (formData) => localApi.post('/templates/import', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const publishTemplate = async (templateData) => {
  const formData = new FormData();
  formData.append('file', new Blob([JSON.stringify(templateData)], {type: 'application/json'}));

  const response = await fetch('https://dev.test.neuralix.ai/api/workspaces/usecases', {
    method: 'POST',
    body: formData,
    headers: {
      'x-nix-wid': localStorage.getItem('workspaceId') // Assuming you store the workspace ID in localStorage
    }
  });

  if (!response.ok) {
    throw new Error('Failed to publish template');
  }

  return response.json();
};

export const createTemplate = (data) => localApi.post('/templates', data);
export const updateTemplate = (id, data) => localApi.put(`/templates/${id}`, data);
export const getSuggestions = async (context) => {
  const response = await axios.post('http://localhost:8000/llm/suggestions/', context);
  return response.data;
};

export const getTemplateVersions = (templateId) => 
    localApi.get(`/templates/${templateId}/versions`);

export const getTemplateDiff = (templateId, version1, version2) => 
    localApi.get(`/templates/${templateId}/diff`, {
        params: { version1, version2 }
    });