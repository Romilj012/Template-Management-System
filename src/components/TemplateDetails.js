import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate } from '../services/api';
import TagInput from './TagInput';
import JsonEditor from './JsonEditor';
import Sidebar from './Sidebar';
import Header from './Header'; 
import { Box, Typography, Button, CircularProgress } from '@mui/material';

const defaultConfigs = {
  DASHBOARD: {
    key: "",
    displayName: "",
    description: "",
    config: {
      updateInterval: "5s"
    },
    paramsSchema: {
      type: "object",
      properties: {},
      required: []
    },
    charts: []
  },
  DATASTORE: {
    key: "",
    displayName: "",
    description: "",
    dataSchema: {
      type: "object",
      properties: {}
    }
  },
  METRIC: {
    key: "",
    displayName: "",
    description: "",
    metricType: "timeseries",
    dataConfig: {
      metricKey: "",
      fieldName: "",
      defaultParams: {}
    }
  },
  ALERT: {
    key: "",
    displayName: "",
    description: "",
    metricKey: "",
    conditions: [],
    severity: "warning"
  },
  FEATURESTORE: {
    key: "",
    displayName: "",
    description: "",
    features: []
  },
  INFERENCESTORE: {
    key: "",
    displayName: "",
    description: "",
    modelKey: "",
    inputSchema: {
      type: "object",
      properties: {}
    },
    outputSchema: {
      type: "object",
      properties: {}
    }
  },
  MODEL: {
    key: "",
    displayName: "",
    description: "",
    modelType: "",
    inputSchema: {
      type: "object",
      properties: {}
    },
    outputSchema: {
      type: "object",
      properties: {}
    }
  }
};

function TemplateDetails({ user, onLogout }) {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState('');
  const [newResourceConfig, setNewResourceConfig] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await getTemplate(id);
      console.log('Fetched template:', response.data);
      setTemplate(response.data);
    } catch (err) {
      console.error('Error fetching template:', err);
      setError('Failed to fetch template details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating template with data:', template);
      await updateTemplate(id, template);
      setEditMode(false);
      fetchTemplate();
    } catch (err) {
      console.error('Error updating template:', err);
      setError('Failed to update template');
    }
  };

  const handleTagsChange = (newTags) => {
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      tags: newTags
    }));
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const resourceData = {
        name: newResourceName,
        type: newResourceType,
        config: newResourceConfig
      };
      await createResource(id, resourceData);
      setNewResourceName('');
      setNewResourceType('');
      setNewResourceConfig({});
      fetchTemplate();
    } catch (err) {
      console.error('Error adding resource:', err);
      setError('Failed to add resource');
    }
  };

  const handleUpdateResource = async (resourceId, resourceData) => {
    try {
      await updateResource(resourceId, resourceData);
      fetchTemplate();
    } catch (err) {
      console.error('Error updating resource:', err);
      setError('Failed to update resource');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await deleteResource(resourceId);
      fetchTemplate();
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError('Failed to delete resource');
    }
  };

  const handlePublish = async () => {
     try {
       await publishTemplate(id);
       fetchTemplate();
     } catch (err) {
       console.error('Error publishing template:', err);
       setError('Failed to publish template');
     }
   };

   const handleResourceTypeChange = (e) => {
     const type = e.target.value;
     setNewResourceType(type);
     setNewResourceConfig(defaultConfigs[type] || {});
   };

   if (loading) return (
     <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
       <CircularProgress />
     </Box>
   );

   if (error) return (
     <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
       <Typography color="error">{error}</Typography>
     </Box>
   );

   if (!template) return null;

   return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header user={user} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
           <Typography variant="h4">{template.name}</Typography>
           {editMode ? (
             <form onSubmit={handleUpdateTemplate}>
               <input
                 type="text"
                 value={template.name}
                 onChange={(e) => setTemplate({...template, name:e.target.value})}
               />
               <textarea
                 value={template.description}
                 onChange={(e) => setTemplate({...template, description:e.target.value})}
               />
               <TagInput
                 tags={template.tags || []}
                 setTags={handleTagsChange}
                 templateId={id}
               />
               <Button type="submit" variant="contained" color="primary">Save</Button>
               <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
             </form>
           ) : (
             <>
               <Typography>{template.description}</Typography>
               {/* <Typography>Status : {template.status}</Typography> */}
               <Typography variant="h6">Tags:</Typography>
               <ul>
                 {template.tags && template.tags.length > 0 ? (
                   template.tags.map((tag, index) => (
                     <li key={index}>{tag}</li>
                   ))
                 ) : (
                   <li>No tags available</li>
                 )}
               </ul>
               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
               {template.status !== 'PUBLISHED' && (
                 <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
               )}
             </>
           )}
           <Typography variant="h5">Resources</Typography>
           <form onSubmit={handleAddResource}>
             <input
               type="text"
               value={newResourceName}
               onChange={(e) => setNewResourceName(e.target.value)}
               placeholder="Resource Name"
               required
             />
             <select
               value={newResourceType}
               onChange={handleResourceTypeChange}
               required
             >
               <option value="">Select Type</option>
               <option value="DASHBOARD">Dashboard</option>
               <option value="DATASTORE">Datastore</option>
               <option value="METRIC">Metric</option>
               <option value="ALERT">Alert</option>
               <option value="FEATURESTORE">Feature Store</option>
               <option value="INFERENCESTORE">Inference Store</option>
               <option value="MODEL">Model</option>
             </select>
             <JsonEditor
               json={newResourceConfig}
               onChange={setNewResourceConfig}
             />
             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
           </form>
           <ul>
             {template.resources.map(resource => (
               <li key={resource.id}>
                 <Typography variant="h6">{resource.name}</Typography>
                 <Typography>Type : {resource.type}</Typography>
                 <JsonEditor
                   json={resource.config}
                   onChange={(config) => handleUpdateResource(resource.id, {...resource, config})}
                 />
                 <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
               </li>
             ))}
           </ul>
           <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
         </Box>
       </Box>
     </Box>
   );
}

export default TemplateDetails;