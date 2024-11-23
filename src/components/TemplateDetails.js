//working 11/19 10:52
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header'; 
// import { Box, Typography, Button, CircularProgress } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: {
//       updateInterval: "5s"
//     },
//     paramsSchema: {
//       type: "object",
//       properties: {},
//       required: []
//     },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: {
//       type: "object",
//       properties: {}
//     }
//   },
//   METRIC: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricType: "timeseries",
//     dataConfig: {
//       metricKey: "",
//       fieldName: "",
//       defaultParams: {}
//     }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     features: []
//   },
//   INFERENCESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelKey: "",
//     inputSchema: {
//       type: "object",
//       properties: {}
//     },
//     outputSchema: {
//       type: "object",
//       properties: {}
//     }
//   },
//   MODEL: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelType: "",
//     inputSchema: {
//       type: "object",
//       properties: {}
//     },
//     outputSchema: {
//       type: "object",
//       properties: {}
//     }
//   }
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       console.log('Fetched template:', response.data);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Updating template with data:', template);
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({
//       ...prevTemplate,
//       tags: newTags
//     }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = {
//         name: newResourceName,
//         type: newResourceType,
//         config: newResourceConfig
//       };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//      try {
//        await publishTemplate(id);
//        fetchTemplate();
//      } catch (err) {
//        console.error('Error publishing template:', err);
//        setError('Failed to publish template');
//      }
//    };

//    const handleResourceTypeChange = (e) => {
//      const type = e.target.value;
//      setNewResourceType(type);
//      setNewResourceConfig(defaultConfigs[type] || {});
//    };

//    if (loading) return (
//      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
//        <CircularProgress />
//      </Box>
//    );

//    if (error) return (
//      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
//        <Typography color="error">{error}</Typography>
//      </Box>
//    );

//    if (!template) return null;

//    return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//            <Typography variant="h4">{template.name}</Typography>
//            {editMode ? (
//              <form onSubmit={handleUpdateTemplate}>
//                <input
//                  type="text"
//                  value={template.name}
//                  onChange={(e) => setTemplate({...template, name:e.target.value})}
//                />
//                <textarea
//                  value={template.description}
//                  onChange={(e) => setTemplate({...template, description:e.target.value})}
//                />
//                <TagInput
//                  tags={template.tags || []}
//                  setTags={handleTagsChange}
//                  templateId={id}
//                />
//                <Button type="submit" variant="contained" color="primary">Save</Button>
//                <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
//              </form>
//            ) : (
//              <>
//                <Typography>{template.description}</Typography>
//                {/* <Typography>Status : {template.status}</Typography> */}
//                <Typography variant="h6">Tags:</Typography>
//                <ul>
//                  {template.tags && template.tags.length > 0 ? (
//                    template.tags.map((tag, index) => (
//                      <li key={index}>{tag}</li>
//                    ))
//                  ) : (
//                    <li>No tags available</li>
//                  )}
//                </ul>
//                <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//                {template.status !== 'PUBLISHED' && (
//                  <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
//                )}
//              </>
//            )}
//            <Typography variant="h5">Resources</Typography>
//            <form onSubmit={handleAddResource}>
//              <input
//                type="text"
//                value={newResourceName}
//                onChange={(e) => setNewResourceName(e.target.value)}
//                placeholder="Resource Name"
//                required
//              />
//              <select
//                value={newResourceType}
//                onChange={handleResourceTypeChange}
//                required
//              >
//                <option value="">Select Type</option>
//                <option value="DASHBOARD">Dashboard</option>
//                <option value="DATASTORE">Datastore</option>
//                <option value="METRIC">Metric</option>
//                <option value="ALERT">Alert</option>
//                <option value="FEATURESTORE">Feature Store</option>
//                <option value="INFERENCESTORE">Inference Store</option>
//                <option value="MODEL">Model</option>
//              </select>
//              <JsonEditor
//                json={newResourceConfig}
//                onChange={setNewResourceConfig}
//              />
//              <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//            </form>
//            <ul>
//              {template.resources.map(resource => (
//                <li key={resource.id}>
//                  <Typography variant="h6">{resource.name}</Typography>
//                  <Typography>Type : {resource.type}</Typography>
//                  <JsonEditor
//                    json={resource.config}
//                    onChange={(config) => handleUpdateResource(resource.id, {...resource, config})}
//                  />
//                  <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
//                </li>
//              ))}
//            </ul>
//            <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
//          </Box>
//        </Box>
//      </Box>
//    );
// }

// export default TemplateDetails;

//working 11/19 8:15
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, importTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Box, Typography, Button, CircularProgress, Input, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: { key: "", displayName: "", description: "", config: { updateInterval: "5s" }, paramsSchema: { type: "object", properties: {}, required: [] }, charts: [] },
//   DATASTORE: { key: "", displayName: "", description: "", dataSchema: { type: "object", properties: {} } },
//   METRIC: { key: "", displayName: "", description: "", metricType: "timeseries", dataConfig: { metricKey: "", fieldName: "", defaultParams: {} } },
//   ALERT: { key: "", displayName: "", description: "", metricKey: "", conditions: [], severity: "warning" },
//   FEATURESTORE: { key: "", displayName: "", description: "", features: [] },
//   INFERENCESTORE: { key: "", displayName: "", description: "", modelKey: "", inputSchema: { type: "object", properties: {} }, outputSchema: { type: "object", properties: {} } },
//   MODEL: { key: "", displayName: "", description: "", modelType: "", inputSchema: { type: "object", properties: {} }, outputSchema: { type: "object", properties: {} } }
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const [importFile, setImportFile] = useState(null);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({
//       ...prevTemplate,
//       tags: newTags
//     }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = {
//         name: newResourceName,
//         type: newResourceType,
//         config: newResourceConfig
//       };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//     try {
//       await publishTemplate(id);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error publishing template:', err);
//       setError('Failed to publish template');
//     }
//   };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleImportTemplate = async (e) => {
//     e.preventDefault();
//     if (!importFile) {
//       setError('Please select a file to import');
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append('file', importFile);
//       const response = await importTemplate(formData);
//       setTemplate(response.data);
//       console.log('Import successful:', response.data);
//     } catch (err) {
//       console.error('Error importing template:', err);
//       if (err.response && err.response.data) {
//         setError(`Failed to import template: ${err.response.data.detail || JSON.stringify(err.response.data)}`);
//       } else {
//         setError('Failed to import template: ' + err.message);
//       }
//     }
//   };

//   const handleExportTemplate = async () => {
//     try {
//       const response = await exportTemplate(template.id);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.name}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error('Error exporting template:', err);
//       setError('Failed to export template');
//     }
//   };

//   const handleFileChange = (e) => {
//     setImportFile(e.target.files[0]);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           <Typography variant="h4">{template.name}</Typography>
          
//           {/* Import form */}
//           <form onSubmit={handleImportTemplate}>
//             <Input type="file" onChange={handleFileChange} />
//             <Button type="submit" variant="contained" color="primary">
//               Import Template
//             </Button>
//           </form>

//           {/* Export button */}
//           <Button onClick={handleExportTemplate} variant="contained" color="primary">
//             Export Template
//           </Button>

//           {editMode ? (
//             <form onSubmit={handleUpdateTemplate}>
//               <input
//                 type="text"
//                 value={template.name}
//                 onChange={(e) => setTemplate({ ...template, name: e.target.value })}
//               />
//               <textarea
//                 value={template.description}
//                 onChange={(e) => setTemplate({ ...template, description: e.target.value })}
//               />
//               <TagInput
//                 tags={template.tags}
//                 setTags={(newTags) => setTemplate({ ...template, tags: newTags })}
//                 templateId={id}
//               />
//               <Button type="submit" variant="contained" color="primary">Save</Button>
//             </form>
//           ) : (
//             <>
//               <Typography>{template.description}</Typography>
//               <Typography>Status: {template.status}</Typography>
//               <TagInput
//                 tags={template.tags || []}
//                 setTags={handleTagsChange}
//                 templateId={id}
//               />
//               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//               {template.status !== 'PUBLISHED' && (
//                 <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
//               )}
//             </>
//           )}

//           <Typography variant="h5">Resources</Typography>
//           <form onSubmit={handleAddResource}>
//             <FormControl fullWidth>
//               <InputLabel>Resource Type</InputLabel>
//               <Select
//                 value={newResourceType}
//                 onChange={handleResourceTypeChange}
//                 required
//               >
//                 <MenuItem value="">Select Type</MenuItem>
//                 <MenuItem value="DASHBOARD">Dashboard</MenuItem>
//                 <MenuItem value="DATASTORE">Datastore</MenuItem>
//                 <MenuItem value="METRIC">Metric</MenuItem>
//                 <MenuItem value="ALERT">Alert</MenuItem>
//                 <MenuItem value="FEATURESTORE">Feature Store</MenuItem>
//                 <MenuItem value="INFERENCESTORE">Inference Store</MenuItem>
//                 <MenuItem value="MODEL">Model</MenuItem>
//               </Select>
//             </FormControl>
//             <input
//               type="text"
//               value={newResourceName}
//               onChange={(e) => setNewResourceName(e.target.value)}
//               placeholder="Resource Name"
//               required
//             />
//             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//           </form>

//           {template.resources.map(resource => (
//             <Box key={resource.id} sx={{ mt: 2 }}>
//               <Typography variant="h6">{resource.name}</Typography>
//               <Typography>Type: {resource.type}</Typography>
//               <JsonEditor
//                 json={resource.config}
//                 onChange={(newConfig) => handleUpdateResource(resource.id, {...resource, config: newConfig})}
//               />
//               <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">
//                 Delete
//               </Button>
//             </Box>
//           ))}

//           <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default TemplateDetails;



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, importTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Box, Typography, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: { updateInterval: "5s" },
//     paramsSchema: { type: "object", properties: {}, required: [] },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: { type: "object", properties: {} }
//   },
//   METRIC: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricType: "timeseries",
//     dataConfig: { metricKey: "", fieldName: "", defaultParams: {} }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     features: []
//   },
//   INFERENCESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelKey: "",
//     inputSchema: { type: "object", properties: {} },
//     outputSchema: { type: "object", properties: {} }
//   },
//   MODEL: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelType: "",
//     inputSchema: { type: "object", properties: {} },
//     outputSchema: { type: "object", properties: {} }
//   }
// };
// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const [importFile, setImportFile] = useState(null);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({
//       ...prevTemplate,
//       tags: newTags
//     }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = {
//         name: newResourceName,
//         type: newResourceType,
//         config: newResourceConfig
//       };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//     try {
//       await publishTemplate(id);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error publishing template:', err);
//       setError('Failed to publish template');
//     }
//   };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleImportTemplate = async (e) => {
//     e.preventDefault();
//     if (!importFile) {
//       setError('Please select a file to import');
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append('file', importFile);
//       const response = await importTemplate(formData);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error importing template:', err);
//       setError('Failed to import template');
//     }
//   };

//   const handleExportTemplate = async () => {
//     try {
//       const response = await exportTemplate(template.id);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.name}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error('Error exporting template:', err);
//       setError('Failed to export template');
//     }
//   };

//   const handleFileChange = (e) => {
//     setImportFile(e.target.files[0]);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           <Typography variant="h4">{template.name}</Typography>
          
//           {/* Import form */}
//           <form onSubmit={handleImportTemplate}>
//             <Input type="file" onChange={handleFileChange} />
//             <Button type="submit" variant="contained" color="primary">
//               Import Template
//             </Button>
//           </form>

//           {/* Export button */}
//           <Button onClick={handleExportTemplate} variant="contained" color="primary">
//             Export Template
//           </Button>

//           {editMode ? (
//             <form onSubmit={handleUpdateTemplate}>
//               <input
//                 type="text"
//                 value={template.name}
//                 onChange={(e) => setTemplate({ ...template, name: e.target.value })}
//               />
//               <textarea
//                 value={template.description}
//                 onChange={(e) => setTemplate({ ...template, description: e.target.value })}
//               />
//               <TagInput
//                 tags={template.tags}
//                 setTags={(newTags) => setTemplate({ ...template, tags: newTags })}
//                 templateId={id}
//               />
//               <Button type="submit" variant="contained" color="primary">Save</Button>
//             </form>
//           ) : (
//             <>
//               <Typography>{template.description}</Typography>
//               <Typography>Status: {template.status}</Typography>
//               <TagInput
//                 tags={template.tags || []}
//                 setTags={handleTagsChange}
//                 templateId={id}
//               />
//               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//               {template.status !== 'PUBLISHED' && (
//                 <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
//               )}
//             </>
//           )}

//           <Typography variant="h5">Resources</Typography>
//           <form onSubmit={handleAddResource}>
//             <FormControl fullWidth>
//               <InputLabel>Resource Type</InputLabel>
//               <Select
//                 value={newResourceType}
//                 onChange={handleResourceTypeChange}
//                 required
//               >
//                 <MenuItem value="">Select Type</MenuItem>
//                 <MenuItem value="DASHBOARD">Dashboard</MenuItem>
//                 <MenuItem value="DATASTORE">Datastore</MenuItem>
//                 <MenuItem value="METRIC">Metric</MenuItem>
//                 <MenuItem value="ALERT">Alert</MenuItem>
//                 <MenuItem value="FEATURESTORE">Feature Store</MenuItem>
//                 <MenuItem value="INFERENCESTORE">Inference Store</MenuItem>
//                 <MenuItem value="MODEL">Model</MenuItem>
//               </Select>
//             </FormControl>
//             <input
//               type="text"
//               value={newResourceName}
//               onChange={(e) => setNewResourceName(e.target.value)}
//               placeholder="Resource Name"
//               required
//             />
//             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//           </form>

//           {template.resources.map(resource => (
//             <Box key={resource.id} sx={{ mt: 2 }}>
//               <Typography variant="h6">{resource.name}</Typography>
//               <Typography>Type: {resource.type}</Typography>
//               <JsonEditor
//                 json={resource.config}
//                 onChange={(newConfig) => handleUpdateResource(resource.id, {...resource, config: newConfig})}
//               />
//               <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">
//                 Delete
//               </Button>
//             </Box>
//           ))}

//           <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default TemplateDetails;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Box, Typography, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//         key: "",
//         displayName: "",
//         description: "",
//         config: { updateInterval: "5s" },
//         paramsSchema: { type: "object", properties: {}, required: [] },
//         charts: []
//       },
//       DATASTORE: {
//         key: "",
//         displayName: "",
//         description: "",
//         dataSchema: { type: "object", properties: {} }
//       },
//       METRIC: {
//         key: "",
//         displayName: "",
//         description: "",
//         metricType: "timeseries",
//         dataConfig: { metricKey: "", fieldName: "", defaultParams: {} }
//       },
//       ALERT: {
//         key: "",
//         displayName: "",
//         description: "",
//         metricKey: "",
//         conditions: [],
//         severity: "warning"
//       },
//       FEATURESTORE: {
//         key: "",
//         displayName: "",
//         description: "",
//         features: []
//       },
//       INFERENCESTORE: {
//         key: "",
//         displayName: "",
//         description: "",
//         modelKey: "",
//         inputSchema: { type: "object", properties: {} },
//         outputSchema: { type: "object", properties: {} }
//       },
//   MODEL: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelType: "",
//     inputSchema: { type: "object", properties: {} },
//     outputSchema: { type: "object", properties: {} },
//     source: {
//       requirements: "",
//       init: "",
//       config: "",
//       model: ""
//     }
//   }
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const fetchTemplate = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchTemplate();
//   }, [fetchTemplate]);

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({
//       ...prevTemplate,
//       tags: newTags
//     }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = {
//         name: newResourceName,
//         type: newResourceType,
//         config: newResourceConfig
//       };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//     try {
//       await publishTemplate(id);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error publishing template:', err);
//       setError('Failed to publish template');
//     }
//   };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleExport = async () => {
//     try {
//       const response = await exportTemplate(template.id);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.name}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error('Error exporting template:', err);
//       setError('Failed to export template');
//     }
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           <Typography variant="h4">{template.name}</Typography>
//           {editMode ? (
//             <form onSubmit={handleUpdateTemplate}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 value={template.name}
//                 onChange={(e) => setTemplate({ ...template, name: e.target.value })}
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 label="Description"
//                 multiline
//                 rows={4}
//                 value={template.description}
//                 onChange={(e) => setTemplate({ ...template, description: e.target.value })}
//                 margin="normal"
//               />
//               <TagInput
//                 tags={template.tags}
//                 setTags={(newTags) => setTemplate({ ...template, tags: newTags })}
//                 templateId={id}
//               />
//               <Button type="submit" variant="contained" color="primary">Save</Button>
//             </form>
//           ) : (
//             <>
//               <Typography>{template.description}</Typography>
//               <Typography>Status: {template.status}</Typography>
//               <TagInput
//                 tags={template.tags || []}
//                 setTags={handleTagsChange}
//                 templateId={id}
//               />
//               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//               {template.status !== 'PUBLISHED' && (
//                 <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
//               )}
//             </>
//           )}

//           <Typography variant="h5">Resources</Typography>
//           {template.resources.map(resource => (
//             <Box key={resource.id} sx={{ mt: 2 }}>
//               <Typography variant="h6">{resource.name}</Typography>
//               <Typography>Type: {resource.type}</Typography>
//               <JsonEditor
//                 json={resource.config}
//                 onChange={(newConfig) => handleUpdateResource(resource.id, {...resource, config: newConfig})}
//               />
//               {resource.type === 'MODEL' && (
//                 <Box>
//                   <Typography variant="h6">Model Source Files</Typography>
//                   <TextField
//                     fullWidth
//                     label="requirements.txt"
//                     multiline
//                     rows={4}
//                     value={resource.config.source?.requirements || ''}
//                     onChange={(e) => handleUpdateResource(resource.id, {
//                       ...resource,
//                       config: {
//                         ...resource.config,
//                         source: { ...resource.config.source, requirements: e.target.value }
//                       }
//                     })}
//                     margin="normal"
//                   />
//                   <TextField
//                     fullWidth
//                     label="__init__.py"
//                     multiline
//                     rows={4}
//                     value={resource.config.source?.init || ''}
//                     onChange={(e) => handleUpdateResource(resource.id, {
//                       ...resource,
//                       config: {
//                         ...resource.config,
//                         source: { ...resource.config.source, init: e.target.value }
//                       }
//                     })}
//                     margin="normal"
//                   />
//                   <TextField
//                     fullWidth
//                     label="config.py"
//                     multiline
//                     rows={4}
//                     value={resource.config.source?.config || ''}
//                     onChange={(e) => handleUpdateResource(resource.id, {
//                       ...resource,
//                       config: {
//                         ...resource.config,
//                         source: { ...resource.config.source, config: e.target.value }
//                       }
//                     })}
//                     margin="normal"
//                   />
//                   <TextField
//                     fullWidth
//                     label="model.py"
//                     multiline
//                     rows={4}
//                     value={resource.config.source?.model || ''}
//                     onChange={(e) => handleUpdateResource(resource.id, {
//                       ...resource,
//                       config: {
//                         ...resource.config,
//                         source: { ...resource.config.source, model: e.target.value }
//                       }
//                     })}
//                     margin="normal"
//                   />
//                 </Box>
//               )}
//               <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">
//                 Delete
//               </Button>
//             </Box>
//           ))}

//           <form onSubmit={handleAddResource}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Resource Type</InputLabel>
//               <Select
//                 value={newResourceType}
//                 onChange={handleResourceTypeChange}
//                 required
//               >
//                 <MenuItem value="">Select Type</MenuItem>
//                 <MenuItem value="DASHBOARD">Dashboard</MenuItem>
//                 <MenuItem value="DATASTORE">Datastore</MenuItem>
//                 <MenuItem value="METRIC">Metric</MenuItem>
//                 <MenuItem value="ALERT">Alert</MenuItem>
//                 <MenuItem value="FEATURESTORE">Feature Store</MenuItem>
//                 <MenuItem value="INFERENCESTORE">Inference Store</MenuItem>
//                 <MenuItem value="MODEL">Model</MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               fullWidth
//               label="Resource Name"
//               value={newResourceName}
//               onChange={(e) => setNewResourceName(e.target.value)}
//               required
//               margin="normal"
//             />
//             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//           </form>

//           <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default TemplateDetails;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import { Box, Typography, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//             key: "",
//             displayName: "",
//             description: "",
//             config: { updateInterval: "5s" },
//             paramsSchema: { type: "object", properties: {}, required: [] },
//             charts: []
//           },
//           DATASTORE: {
//             key: "",
//             displayName: "",
//             description: "",
//             dataSchema: { type: "object", properties: {} }
//           },
//           METRIC: {
//             key: "",
//             displayName: "",
//             description: "",
//             metricType: "timeseries",
//             dataConfig: { metricKey: "", fieldName: "", defaultParams: {} }
//           },
//           ALERT: {
//             key: "",
//             displayName: "",
//             description: "",
//             metricKey: "",
//             conditions: [],
//             severity: "warning"
//           },
//           FEATURESTORE: {
//             key: "",
//             displayName: "",
//             description: "",
//             features: []
//           },
//           INFERENCESTORE: {
//             key: "",
//             displayName: "",
//             description: "",
//             modelKey: "",
//             inputSchema: { type: "object", properties: {} },
//             outputSchema: { type: "object", properties: {} }
//           },
//   MODEL: { 
//     key: "", 
//     displayName: "", 
//     description: "", 
//     modelType: "", 
//     inputSchema: { type: "object", properties: {} }, 
//     outputSchema: { type: "object", properties: {} },
//     source: {
//       requirements: "",
//       init: "",
//       config: "",
//       model: ""
//     }
//   }
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({
//       ...prevTemplate,
//       tags: newTags
//     }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = {
//         name: newResourceName,
//         type: newResourceType,
//         config: newResourceConfig
//       };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//     try {
//       await publishTemplate(id);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error publishing template:', err);
//       setError('Failed to publish template');
//     }
//   };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleExport = async () => {
//     try {
//       const response = await exportTemplate(template.id);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.name}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error('Error exporting template:', err);
//       setError('Failed to export template');
//     }
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h4">{template.name}</Typography>
//         <Button onClick={handleExport} variant="contained" color="primary">
//           Export Template
//         </Button>
//       </Box>
      
//       {editMode ? (
//         <form onSubmit={handleUpdateTemplate}>
//           <TextField
//             fullWidth
//             label="Name"
//             value={template.name}
//             onChange={(e) => setTemplate({ ...template, name: e.target.value })}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Description"
//             multiline
//             rows={4}
//             value={template.description}
//             onChange={(e) => setTemplate({ ...template, description: e.target.value })}
//             margin="normal"
//           />
//           <TagInput
//             tags={template.tags}
//             setTags={(newTags) => setTemplate({ ...template, tags: newTags })}
//             templateId={id}
//           />
//           <Button type="submit" variant="contained" color="primary">Save</Button>
//         </form>
//       ) : (
//         <>
//           <Typography>{template.description}</Typography>
//           <Typography>Status: {template.status}</Typography>
//           <TagInput
//             tags={template.tags || []}
//             setTags={handleTagsChange}
//             templateId={id}
//           />
//           <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//           {template.status !== 'PUBLISHED' && (
//             <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
//           )}
//         </>
//       )}

//       <Typography variant="h5">Resources</Typography>
//       {template.resources.map(resource => (
//         <Box key={resource.id} sx={{ mt: 2 }}>
//           <Typography variant="h6">{resource.name}</Typography>
//           <Typography>Type: {resource.type}</Typography>
//           <JsonEditor
//             json={resource.config}
//             onChange={(newConfig) => handleUpdateResource(resource.id, {...resource, config: newConfig})}
//           />
//           {resource.type === 'MODEL' && (
//             <Box>
//               <Typography variant="h6">Model Source Files</Typography>
//               <TextField
//                 fullWidth
//                 label="requirements.txt"
//                 multiline
//                 rows={4}
//                 value={resource.config.source?.requirements || ''}
//                 onChange={(e) => handleUpdateResource(resource.id, {
//                   ...resource,
//                   config: {
//                     ...resource.config,
//                     source: { ...resource.config.source, requirements: e.target.value }
//                   }
//                 })}
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 label="__init__.py"
//                 multiline
//                 rows={4}
//                 value={resource.config.source?.init || ''}
//                 onChange={(e) => handleUpdateResource(resource.id, {
//                   ...resource,
//                   config: {
//                     ...resource.config,
//                     source: { ...resource.config.source, init: e.target.value }
//                   }
//                 })}
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 label="config.py"
//                 multiline
//                 rows={4}
//                 value={resource.config.source?.config || ''}
//                 onChange={(e) => handleUpdateResource(resource.id, {
//                   ...resource,
//                   config: {
//                     ...resource.config,
//                     source: { ...resource.config.source, config: e.target.value }
//                   }
//                 })}
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 label="model.py"
//                 multiline
//                 rows={4}
//                 value={resource.config.source?.model || ''}
//                 onChange={(e) => handleUpdateResource(resource.id, {
//                   ...resource,
//                   config: {
//                     ...resource.config,
//                     source: { ...resource.config.source, model: e.target.value }
//                   }
//                 })}
//                 margin="normal"
//               />
//             </Box>
//           )}
//           <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">
//             Delete
//           </Button>
//         </Box>
//       ))}

//       <form onSubmit={handleAddResource}>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Resource Type</InputLabel>
//           <Select
//             value={newResourceType}
//             onChange={handleResourceTypeChange}
//             required
//           >
//             <MenuItem value="">Select Type</MenuItem>
//             <MenuItem value="DASHBOARD">Dashboard</MenuItem>
//             <MenuItem value="DATASTORE">Datastore</MenuItem>
//             <MenuItem value="METRIC">Metric</MenuItem>
//             <MenuItem value="ALERT">Alert</MenuItem>
//             <MenuItem value="FEATURESTORE">Feature Store</MenuItem>
//             <MenuItem value="INFERENCESTORE">Inference Store</MenuItem>
//             <MenuItem value="MODEL">Model</MenuItem>
//           </Select>
//         </FormControl>
//         <TextField
//           fullWidth
//           label="Resource Name"
//           value={newResourceName}
//           onChange={(e) => setNewResourceName(e.target.value)}
//           required
//           margin="normal"
//         />
//         <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//       </form>

//       <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
//     </Box>
//   );
// }

// export default TemplateDetails;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: { updateInterval: "5s" },
//     paramsSchema: { type: "object", properties: {}, required: [] },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: { type: "object", properties: {} }
//   },
//   METRIC: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricType: "timeseries",
//     dataConfig: { metricKey: "", fieldName: "", defaultParams: {} }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     features: []
//   },
//   INFERENCESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelKey: "",
//     inputSchema: { type: "object", properties: {} },
//     outputSchema: { type: "object", properties: {} }
//   },
//   MODEL: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelType: "",
//     inputSchema: { type: "object", properties: {} },
//     outputSchema: { type: "object", properties: {} },
//     source: {
//       requirements: "",
//       init: "",
//       config: "",
//       model: ""
//     }
//   }
// };

// const ResourceConfig = ({ resource, onUpdate }) => {
//   const handleConfigChange = (newConfig) => {
//     onUpdate(resource.id, {
//       ...resource,
//       config: {
//         ...resource.config,
//         ...newConfig
//       }
//     });
//   };

//   const renderModelSourceFields = () => {
//     if (resource.type !== 'MODEL') return null;

//     return (
//       <Box className="mt-4">
//         <Typography variant="h6" className="mb-2">Model Source Files</Typography>
//         {['requirements', 'init', 'config', 'model'].map(field => (
//           <TextField
//             key={field}
//             fullWidth
//             label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
//             multiline
//             rows={4}
//             value={resource.config.source?.[field] || ''}
//             onChange={(e) => handleConfigChange({
//               ...resource.config,
//               source: {
//                 ...resource.config.source,
//                 [field]: e.target.value
//               }
//             })}
//             className="mb-4"
//           />
//         ))}
//       </Box>
//     );
//   };

//   return (
//     <Box className="mt-4">
//       <JsonEditor
//         json={resource.config}
//         onChange={handleConfigChange}
//       />
//       {renderModelSourceFields()}
//     </Box>
//   );
// };

// const TemplateDetails = ({ user, onLogout }) => {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prev => ({
//       ...prev,
//       tags: newTags
//     }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const config = defaultConfigs[newResourceType] || {};
//       const resourceData = {
//         name: newResourceName,
//         type: newResourceType,
//         config: config
//       };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       fetchTemplate();
//     } catch (err) {
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//     try {
//       await publishTemplate(id);
//       fetchTemplate();
//     } catch (err) {
//       setError('Failed to publish template');
//     }
//   };

//   const handleExport = async () => {
//     try {
//       const response = await exportTemplate(id);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.name}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError('Failed to export template');
//     }
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!template) return null;

//   return (
//     <Box className="flex flex-col min-h-screen p-6">
//       <Box className="flex justify-between items-center mb-6">
//         <Typography variant="h4">{template.name}</Typography>
//         <Button onClick={handleExport} variant="contained" color="primary">
//           Export Template
//         </Button>
//       </Box>
      
//       {editMode ? (
//         <form onSubmit={handleUpdateTemplate} className="space-y-4">
//           <TextField
//             fullWidth
//             label="Name"
//             value={template.name}
//             onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
//           />
//           <TextField
//             fullWidth
//             label="Description"
//             multiline
//             rows={4}
//             value={template.description}
//             onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
//           />
//           <TagInput
//             tags={template.tags}
//             setTags={(newTags) => setTemplate(prev => ({ ...prev, tags: newTags }))}
//             templateId={id}
//           />
//           <Button type="submit" variant="contained" color="primary">Save</Button>
//         </form>
//       ) : (
//         <Box className="space-y-4">
//           <Typography>{template.description}</Typography>
//           <Typography>Status: {template.status}</Typography>
//           <TagInput
//             tags={template.tags || []}
//             setTags={handleTagsChange}
//             templateId={id}
//           />
//           <Box className="space-x-4">
//             <Button onClick={() => setEditMode(true)} variant="contained" color="primary">
//               Edit
//             </Button>
//             {template.status !== 'PUBLISHED' && (
//               <Button onClick={handlePublish} variant="contained" color="secondary">
//                 Publish
//               </Button>
//             )}
//           </Box>
//         </Box>
//       )}

//       <Typography variant="h5" className="mt-8 mb-4">Resources</Typography>
//       {template.resources.map(resource => (
//         <Box key={resource.id} className="mt-6 p-4 border rounded-lg">
//           <Typography variant="h6">{resource.name}</Typography>
//           <Typography className="mb-4">Type: {resource.type}</Typography>
//           <ResourceConfig
//             resource={resource}
//             onUpdate={handleUpdateResource}
//           />
//           <Button 
//             onClick={() => handleDeleteResource(resource.id)} 
//             variant="outlined" 
//             color="error"
//             className="mt-4"
//           >
//             Delete
//           </Button>
//         </Box>
//       ))}

//       <form onSubmit={handleAddResource} className="mt-8 space-y-4">
//         <FormControl fullWidth>
//           <InputLabel>Resource Type</InputLabel>
//           <Select
//             value={newResourceType}
//             onChange={(e) => setNewResourceType(e.target.value)}
//             required
//           >
//             <MenuItem value="">Select Type</MenuItem>
//             {Object.keys(defaultConfigs).map(type => (
//               <MenuItem key={type} value={type}>{type}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <TextField
//           fullWidth
//           label="Resource Name"
//           value={newResourceName}
//           onChange={(e) => setNewResourceName(e.target.value)}
//           required
//         />
//         <Button type="submit" variant="contained" color="primary">
//           Add Resource
//         </Button>
//       </form>

//       <Button 
//         onClick={() => navigate('/')} 
//         variant="contained"
//         className="mt-8"
//       >
//         Back to Dashboard
//       </Button>
//     </Box>
//   );
// };

// export default TemplateDetails;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header'; 
// import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: {
//       updateInterval: "5s"
//     },
//     paramsSchema: {
//       type: "object",
//       properties: {},
//       required: []
//     },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: {
//       type: "object",
//       properties: {}
//     }
//   },
//   METRIC: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricType: "timeseries",
//     dataConfig: {
//       metricKey: "",
//       fieldName: "",
//       defaultParams: {}
//     }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     features: []
//   },
//   INFERENCESTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelKey: "",
//     inputSchema: {
//       type: "object",
//       properties: {}
//     },
//     outputSchema: {
//       type: "object",
//       properties: {}
//     }
//   },
//   MODEL: {
//     key: "",
//     displayName: "",
//     description: "",
//     modelType: "",
//     inputSchema: { type: "object", properties: {} },
//     outputSchema: { type: "object", properties: {} },
//     source: {
//       requirements: "",
//       init: "",
//       config: "",
//       model: ""
//     }
//   }
// };

// // const ResourceConfig = ({ resource, onUpdate }) => {
// //   const handleConfigChange = (newConfig) => {
// //     onUpdate(resource.id, {
// //       ...resource,
// //       config: {
// //         ...resource.config,
// //         ...newConfig
// //       }
// //     });
// //   };

// //   const renderModelSourceFields = () => {
// //     if (resource.type !== 'MODEL') return null;

// //     return (
// //       <Box className="mt-4">
// //         <Typography variant="h6" className="mb-2">Model Source Files</Typography>
// //         {['requirements', 'init', 'config', 'model'].map(field => (
// //           <TextField
// //             key={field}
// //             fullWidth
// //             label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
// //             multiline
// //             rows={4}
// //             value={resource.config.source?.[field] || ''}
// //             onChange={(e) => handleConfigChange({
// //               ...resource.config,
// //               source: {
// //                 ...resource.config.source,
// //                 [field]: e.target.value
// //               }
// //             })}
// //             className="mb-4"
// //           />
// //         ))}
// //       </Box>
// //     );
// //   };

// //   return (
// //     <Box className="mt-4">
// //       <JsonEditor
// //         json={resource.config}
// //         onChange={handleConfigChange}
// //       />
// //       {renderModelSourceFields()}
// //     </Box>
// //   );
// // };

//11/20 11:04
// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       console.log('Fetched template:', response.data);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Updating template with data:', template);
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({
//       ...prevTemplate,
//       tags: newTags
//     }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = {
//         name: newResourceName,
//         type: newResourceType,
//         config: newResourceConfig
//       };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//      try {
//        await publishTemplate(id);
//        fetchTemplate();
//      } catch (err) {
//        console.error('Error publishing template:', err);
//        setError('Failed to publish template');
//      }
//    };

//    const handleResourceTypeChange = (e) => {
//      const type = e.target.value;
//      setNewResourceType(type);
//      setNewResourceConfig(defaultConfigs[type] || {});
//    };

//    const handleExport = async () => {
//     try {
//       const response = await exportTemplate(id);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.name}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError('Failed to export template');
//     }
//   };

//   const ResourceConfig = ({ resource, onUpdate }) => {
//     const handleConfigChange = (newConfig) => {
//       onUpdate(resource.id, {
//         ...resource,
//         config: {
//           ...resource.config,
//           ...newConfig
//         }
//       });
//     };
  
//     const renderModelSourceFields = () => {
//       if (resource.type !== 'MODEL') return null;
  
//       return (
//         <Box className="mt-4">
//           <Typography variant="h6" className="mb-2">Model Source Files</Typography>
//           {['requirements', 'init', 'config', 'model'].map(field => (
//             <TextField
//               key={field}
//               fullWidth
//               label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
//               multiline
//               rows={4}
//               value={resource.config.source?.[field] || ''}
//               onChange={(e) => handleConfigChange({
//                 source: {
//                   ...(resource.config.source || {}),
//                   [field]: e.target.value
//                 }
//               })}
//               className="mb-4"
//               variant="outlined"
//             />
//           ))}
//         </Box>
//       );
//     };
  
//     return (
//       <Box className="mt-4">
//         <JsonEditor
//           json={resource.config}
//           onChange={handleConfigChange}
//         />
//         {renderModelSourceFields()}
//       </Box>
//     );
//   };
//    if (loading) return (
//      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
//        <CircularProgress />
//      </Box>
//    );

//    if (error) return (
//      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
//        <Typography color="error">{error}</Typography>
//      </Box>
//    );

//    if (!template) return null;

//    return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//            <Typography variant="h4">{template.name}</Typography>
//            <Button onClick={handleExport} variant="contained" color="primary">
//         Export Template
//       </Button>
//            {editMode ? (
//              <form onSubmit={handleUpdateTemplate}>
//                <input
//                  type="text"
//                  value={template.name}
//                  onChange={(e) => setTemplate({...template, name:e.target.value})}
//                />
//                <textarea
//                  value={template.description}
//                  onChange={(e) => setTemplate({...template, description:e.target.value})}
//                />
//                <TagInput
//                  tags={template.tags || []}
//                  setTags={handleTagsChange}
//                  templateId={id}
//                />
//                <Button type="submit" variant="contained" color="primary">Save</Button>
//                <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
//              </form>
//            ) : (
//              <>
//                <Typography>{template.description}</Typography>
//                {/* <Typography>Status : {template.status}</Typography> */}
//                <Typography variant="h6">Tags:</Typography>
//                <ul>
//                  {template.tags && template.tags.length > 0 ? (
//                    template.tags.map((tag, index) => (
//                      <li key={index}>{tag}</li>
//                    ))
//                  ) : (
//                    <li>No tags available</li>
//                  )}
//                </ul>
//                <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//                {template.status !== 'PUBLISHED' && (
//                  <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
//                )}
//              </>
//            )}
//            <Typography variant="h5">Resources</Typography>
//            <form onSubmit={handleAddResource}>
//              <input
//                type="text"
//                value={newResourceName}
//                onChange={(e) => setNewResourceName(e.target.value)}
//                placeholder="Resource Name"
//                required
//              />
//              <select
//                value={newResourceType}
//                onChange={handleResourceTypeChange}
//                required
//              >
//                <option value="">Select Type</option>
//                <option value="DASHBOARD">Dashboard</option>
//                <option value="DATASTORE">Datastore</option>
//                <option value="METRIC">Metric</option>
//                <option value="ALERT">Alert</option>
//                <option value="FEATURESTORE">Feature Store</option>
//                <option value="INFERENCESTORE">Inference Store</option>
//                <option value="MODEL">Model</option>
//              </select>
//              <JsonEditor
//                json={newResourceConfig}
//                onChange={setNewResourceConfig}
//              />
//              <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//            </form>
//            <ul>
//              {template.resources.map(resource => (
//                <li key={resource.id}>
//                  <Typography variant="h6">{resource.name}</Typography>
//                  <Typography>Type : {resource.type}</Typography>
//                  <JsonEditor
//                    json={resource.config}
//                    onChange={(config) => handleUpdateResource(resource.id, {...resource, config})}
//                  />
//                  <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
//                </li>
//              ))}
//            </ul>
//            <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
//          </Box>
//        </Box>
//      </Box>
//    );
// }

// export default TemplateDetails;

//working 11/20 1:40 p.m.
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: { updateInterval: "5s" },
//     paramsSchema: { type: "object", properties: {}, required: [] },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: { type: "object", properties: {} }
//   },
//   METRIC: {
//     key: "count_of_microseismic_data",
//     displayName: "Count of Microseismic Data",
//     description: "",
//     sql: "SELECT COUNT(*) as count FROM datastore:microseismic WHERE well_id=:well_id",
//     valueSchema: {
//       type: "object",
//       properties: { count: { type: "integer" } },
//       required: ["count"]
//     },
//     paramsSchema: {
//       type: "object",
//       properties: { well_id: { type: "string" } },
//       required: ["well_id"]
//     }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "well_trip_classification_feature",
//     displayName: "Well Trip Classification Feature",
//     description: "",
//     sql: "SELECT pressure, timestamp FROM datastore:realtime",
//     checkpoint_fields: ["timestamp"],
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         pressure: {
//           type: "number"
//         }
//       },
//       required: [ "timestamp", "pressure"]
//     }
//   },
//   INFERENCESTORE: {
//     key: "well_trip_classifier",
//     displayName: "Well Trip Classifier Predictions",
//     description: "",
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         state: {
//           type: "string"
//         }
//       },
//       required: [ "timestamp", "state"]
//     }
//   },
//   MODEL: {
//     key: "slope_classification",
//     displayName: "Slope Classification",
//     description: "Classifies a timeseries as NORM ( normal ) or TRIP ( tripping / abnormal ) based on slope",
//     supportsTraining: false,
//     supportsGpu: false
//   }
// };

// const ResourceConfig = ({ resource, onUpdate }) => {
  
//   const handleConfigChange = (newConfig) => {
//     onUpdate(resource.id, {
//       ...resource,
//       config: {
//         ...resource.config,
//         ...newConfig
//       }
//     });
//   };

//   const renderModelSourceFields = () => {
//     if (resource.type !== 'MODEL') return null;
//     return (
//       <Box className="mt-4">
//         <Typography variant="h6" className="mb-2">Model Source Files</Typography>
//         {['requirements', 'init', 'config', 'model'].map(field => (
//           <TextField
//             key={field}
//             fullWidth
//             label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
//             multiline
//             rows={4}
//             value={resource.config.source?.[field] || ''}
//             onChange={(e) => handleConfigChange({
//               source: {
//                 ...(resource.config.source || {}),
//                 [field]: e.target.value
//               }
//             })}
//             className="mb-4"
//             variant="outlined"
//           />
//         ))}
//       </Box>
//     );
//   };

//   return (
//     <Box className="mt-4">
//       <JsonEditor
//         json={resource.config}
//         onChange={handleConfigChange}
//       />
//       {renderModelSourceFields()}
//     </Box>
//   );
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       console.log('Fetched template:', response.data);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Updating template with data:', template);
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({ ...prevTemplate, tags: newTags }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = { name: newResourceName, type: newResourceType, config: newResourceConfig };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   const handlePublish = async () => {
//     try {
//       await publishTemplate(id);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error publishing template:', err);
//       setError('Failed to publish template');
//     }
//   };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleExport = async () => {
//     try {
//       const response = await exportTemplate(id);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.name}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError('Failed to export template');
//     }
//   };

//   if (loading) return (
//     <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
//       <CircularProgress />
//     </Box>
//   );

//   if (error) return (
//     <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
//       <Typography color="error">{error}</Typography>
//     </Box>
//   );

//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           <Typography variant="h4">{template.name}</Typography>
//           <Button onClick={handleExport} variant="contained" color="primary">
//             Export Template
//           </Button>
//           {editMode ? (
//             <form onSubmit={handleUpdateTemplate}>
//               <input type="text" value={template.name} onChange={(e) => setTemplate({...template, name:e.target.value})} />
//               <textarea value={template.description} onChange={(e) => setTemplate({...template, description:e.target.value})} />
//               <TagInput tags={template.tags || []} setTags={handleTagsChange} templateId={id} />
//               <Button type="submit" variant="contained" color="primary">Save</Button>
//               <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
//             </form>
//           ) : (
//             <>
//               <Typography>{template.description}</Typography>
//               <Typography variant="h6">Tags:</Typography>
//               <ul>
//                 {template.tags && template.tags.length > 0 ? (
//                   template.tags.map((tag, index) => (
//                     <li key={index}>{tag}</li>
//                   ))
//                 ) : (
//                   <li>No tags available</li>
//                 )}
//               </ul>
//               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//               {template.status !== 'PUBLISHED' && (
//                 <Button onClick={handlePublish} variant="contained" color="secondary">Publish</Button>
//               )}
//             </>
//           )}
//           <Typography variant="h5">Resources</Typography>
//           <form onSubmit={handleAddResource}>
//             <input type="text" value={newResourceName} onChange={(e) => setNewResourceName(e.target.value)} placeholder="Resource Name" required />
//             <select value={newResourceType} onChange={handleResourceTypeChange} required>
//               <option value="">Select Type</option>
//               <option value="DASHBOARD">Dashboard</option>
//               <option value="DATASTORE">Datastore</option>
//               <option value="METRIC">Metric</option>
//               <option value="ALERT">Alert</option>
//               <option value="FEATURESTORE">Feature Store</option>
//               <option value="INFERENCESTORE">Inference Store</option>
//               <option value="MODEL">Model</option>
//             </select>
//             <JsonEditor json={newResourceConfig} onChange={setNewResourceConfig} />
//             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//           </form>
//           <ul>
//             {template.resources.map(resource => (
//               <li key={resource.id}>
//                 <Typography variant="h6">{resource.name}</Typography>
//                 <Typography>Type : {resource.type}</Typography>
//                 <ResourceConfig resource={resource} onUpdate={handleUpdateResource} />
//                 <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
//               </li>
//             ))}
//           </ul>
//           <Button onClick={() => navigate('/')} variant="contained">Back to Dashboard</Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default TemplateDetails;

//working as of 11/21 5:32
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: { updateInterval: "5s" },
//     paramsSchema: { type: "object", properties: {}, required: [] },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: { type: "object", properties: {}, required: [] }
//   },
//   METRIC: {
//     key: "count_of_microseismic_data",
//     displayName: "Count of Microseismic Data",
//     description: "",
//     sql: "SELECT COUNT(*) as count FROM datastore:microseismic WHERE well_id=:well_id",
//     valueSchema: {
//       type: "object",
//       properties: { count: { type: "integer" } },
//       required: ["count"]
//     },
//     paramsSchema: {
//       type: "object",
//       properties: { well_id: { type: "string" } },
//       required: ["well_id"]
//     }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "well_trip_classification_feature",
//     displayName: "Well Trip Classification Feature",
//     description: "",
//     sql: "SELECT pressure, timestamp FROM datastore:realtime",
//     checkpoint_fields: ["timestamp"],
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         pressure: {
//           type: "number"
//         }
//       },
//       required: [ "timestamp", "pressure"]
//     }
//   },
//   INFERENCESTORE: {
//     key: "well_trip_classifier",
//     displayName: "Well Trip Classifier Predictions",
//     description: "",
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         state: {
//           type: "string"
//         }
//       },
//       required: [ "timestamp", "state"]
//     }
//   },
//   MODEL: {
//     key: "slope_classification",
//     displayName: "Slope Classification",
//     description: "Classifies a timeseries as NORM ( normal ) or TRIP ( tripping / abnormal ) based on slope",
//     supportsTraining: false,
//     supportsGpu: false
//   }
// };

// const ResourceConfig = ({ resource, onUpdate }) => {
  
//   const handleConfigChange = (newConfig) => {
//     onUpdate(resource.id, {
//       ...resource,
//       config: {
//         ...resource.config,
//         ...newConfig
//       }
//     });
//   };

//   const renderModelSourceFields = () => {
//     if (resource.type !== 'MODEL') return null;
//     return (
//       <Box className="mt-4">
//         <Typography variant="h6" className="mb-2">Model Source Files</Typography>
//         {['requirements', 'init', 'config', 'model'].map(field => (
//           <TextField
//             key={field}
//             fullWidth
//             label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
//             multiline
//             rows={4}
//             value={resource.config.source?.[field] || ''}
//             onChange={(e) => handleConfigChange({
//               source: {
//                 ...(resource.config.source || {}),
//                 [field]: e.target.value
//               }
//             })}
//             className="mb-4"
//             variant="outlined"
//           />
//         ))}
//       </Box>
//     );
//   };

//   return (
//     <Box className="mt-4">
//       <JsonEditor
//         json={resource.config}
//         onChange={handleConfigChange}
//       />
//       {renderModelSourceFields()}
//     </Box>
//   );
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const [publishSuccess, setPublishSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({ ...prevTemplate, tags: newTags }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = { name: newResourceName, type: newResourceType, config: newResourceConfig };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   // const handlePublish = async () => {
//   //   try {
//   //     await publishWorkspace(id);
//   //     setPublishSuccess(true);
//   //     fetchTemplate();
//   //   } catch (err) {
//   //     console.error('Error publishing workspace:', err);
//   //     setError('Failed to publish workspace');
//   //   }
//   // };

// //   const handlePublish = async () => {
// //     try {
// //         setLoading(true);
// //         const response = await publishTemplate(id, template.name);
// //         if (response.status === 200) {
// //             setTemplate(prevTemplate => ({
// //                 ...prevTemplate,
// //                 status: 'PUBLISHED'
// //             }));
// //             setSuccessMessage('Template published successfully');
// //         } else {
// //             throw new Error(`Unexpected response status: ${response.status}`);
// //         }
// //     } catch (err) {
// //         console.error('Error publishing template:', err);
// //         let errorMessage = 'Failed to publish template';
// //         if (err.response) {
// //             errorMessage = `Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`;
// //         } else if (err.request) {
// //             errorMessage = 'No response received from server. Please check your network connection.';
// //         } else {
// //             errorMessage = `Error: ${err.message}`;
// //         }
// //         setError(errorMessage);
// //     } finally {
// //         setLoading(false);
// //     }
// // };

// const handlePublish = async () => {
//   try {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('file', new Blob([JSON.stringify(template)], {type: 'application/json'}));

//     const response = await fetch('https://dev.test.neuralix.ai/workspaces/api/usecases', {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Authorization': `Bearer ${user.token}`,
//         'x-nix-wid': user.workspaceId || ''
//       }
//     });

//     if (response.ok) {
//       const publishedTemplate = await response.json();
//       setTemplate(prevTemplate => ({
//         ...prevTemplate,
//         status: 'PUBLISHED',
//         id: publishedTemplate.id
//       }));
//       setSuccessMessage('Template published successfully');
//     } else {
//       throw new Error(`Unexpected response status: ${response.status}`);
//     }
//   } catch (err) {
//     console.error('Error publishing template:', err);
//     setError('Failed to publish template');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleExport = async () => {
//     try {
//       const response = await exportTemplate(id);
//       const blob = new Blob([response.data], { type: 'application/octet-stream' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.displayName}.nixdlt`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError('Failed to export template');
//     }
//   };
  
//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
//   if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography color="error">{error}</Typography></Box>;
//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           <Typography variant="h4">{template.displayName}</Typography>
//           <Button onClick={handleExport} variant="contained" color="primary">Export Template</Button>
//           {editMode ? (
//             <form onSubmit={handleUpdateTemplate}>
//               <TextField fullWidth label="Display Name" value={template.displayName} onChange={(e) => setTemplate({...template, displayName: e.target.value})} margin="normal" />
//               <TextField fullWidth label="Description" multiline rows={4} value={template.description} onChange={(e) => setTemplate({...template, description: e.target.value})} margin="normal" />
//               <TagInput tags={template.tags || []} setTags={handleTagsChange} templateId={id} />
//               <Button type="submit" variant="contained" color="primary">Save</Button>
//               <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
//             </form>
//           ) : (
//             <>
//               <Typography>{template.description}</Typography>
//               <Typography variant="h6">Tags:</Typography>
//               <ul>
//                 {template.tags && template.tags.length > 0 ? (
//                   template.tags.map((tag, index) => (
//                     <li key={index}>{tag}</li>
//                   ))
//                 ) : (
//                   <li>No tags available</li>
//                 )}
//               </ul>
//               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//               <Button onClick={handlePublish} variant="contained" color="secondary">Publish Workspace</Button>
//             </>
//           )}
//           <Typography variant="h5">Resources</Typography>
//           <form onSubmit={handleAddResource}>
//             <TextField value={newResourceName} onChange={(e) => setNewResourceName(e.target.value)} placeholder="Resource Name" />
//             <FormControl fullWidth>
//               <InputLabel>Resource Type</InputLabel>
//               <Select value={newResourceType} onChange={handleResourceTypeChange}>
//                 {Object.keys(defaultConfigs).map((type) => (
//                   <MenuItem key={type} value={type}>{type}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <JsonEditor json={newResourceConfig} onChange={setNewResourceConfig} />
//             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//           </form>
//           {template.resources.map((resource) => (
//             <Box key={resource.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
//               <Typography variant="h6">{resource.name} ({resource.type})</Typography>
//               <ResourceConfig resource={resource} onUpdate={handleUpdateResource} />
//               <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//       <Snackbar
//         open={publishSuccess}
//         autoHideDuration={6000}
//         onClose={() => setPublishSuccess(false)}
//         message="Workspace published successfully"
//       />
//     </Box>
//   );
// }

// export default TemplateDetails;
//11/22 9:59
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: { updateInterval: "5s" },
//     paramsSchema: { type: "object", properties: {}, required: [] },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: { type: "object", properties: {}, required: [] }
//   },
//   METRIC: {
//     key: "count_of_microseismic_data",
//     displayName: "Count of Microseismic Data",
//     description: "",
//     sql: "SELECT COUNT(*) as count FROM datastore:microseismic WHERE well_id=:well_id",
//     valueSchema: {
//       type: "object",
//       properties: { count: { type: "integer" } },
//       required: ["count"]
//     },
//     paramsSchema: {
//       type: "object",
//       properties: { well_id: { type: "string" } },
//       required: ["well_id"]
//     }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "well_trip_classification_feature",
//     displayName: "Well Trip Classification Feature",
//     description: "",
//     sql: "SELECT pressure, timestamp FROM datastore:realtime",
//     checkpoint_fields: ["timestamp"],
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         pressure: {
//           type: "number"
//         }
//       },
//       required: [ "timestamp", "pressure"]
//     }
//   },
//   INFERENCESTORE: {
//     key: "well_trip_classifier",
//     displayName: "Well Trip Classifier Predictions",
//     description: "",
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         state: {
//           type: "string"
//         }
//       },
//       required: [ "timestamp", "state"]
//     }
//   },
//   MODEL: {
//     key: "slope_classification",
//     displayName: "Slope Classification",
//     description: "Classifies a timeseries as NORM ( normal ) or TRIP ( tripping / abnormal ) based on slope",
//     supportsTraining: false,
//     supportsGpu: false
//   }
// };

// const ResourceConfig = ({ resource, onUpdate }) => {
  
//   const handleConfigChange = (newConfig) => {
//     onUpdate(resource.id, {
//       ...resource,
//       config: {
//         ...resource.config,
//         ...newConfig
//       }
//     });
//   };

//   const renderModelSourceFields = () => {
//     if (resource.type !== 'MODEL') return null;
//     return (
//       <Box className="mt-4">
//         <Typography variant="h6" className="mb-2">Model Source Files</Typography>
//         {['requirements', 'init', 'config', 'model'].map(field => (
//           <TextField
//             key={field}
//             fullWidth
//             label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
//             multiline
//             rows={4}
//             value={resource.config.source?.[field] || ''}
//             onChange={(e) => handleConfigChange({
//               source: {
//                 ...(resource.config.source || {}),
//                 [field]: e.target.value
//               }
//             })}
//             className="mb-4"
//             variant="outlined"
//           />
//         ))}
//       </Box>
//     );
//   };

//   return (
//     <Box className="mt-4">
//       <JsonEditor
//         json={resource.config}
//         onChange={handleConfigChange}
//       />
//       {renderModelSourceFields()}
//     </Box>
//   );
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const [publishSuccess, setPublishSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//   }, [id]);

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({ ...prevTemplate, tags: newTags }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = { name: newResourceName, type: newResourceType, config: newResourceConfig };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };

//   // const handlePublish = async () => {
//   //   try {
//   //     await publishWorkspace(id);
//   //     setPublishSuccess(true);
//   //     fetchTemplate();
//   //   } catch (err) {
//   //     console.error('Error publishing workspace:', err);
//   //     setError('Failed to publish workspace');
//   //   }
//   // };

// //   const handlePublish = async () => {
// //     try {
// //         setLoading(true);
// //         const response = await publishTemplate(id, template.name);
// //         if (response.status === 200) {
// //             setTemplate(prevTemplate => ({
// //                 ...prevTemplate,
// //                 status: 'PUBLISHED'
// //             }));
// //             setSuccessMessage('Template published successfully');
// //         } else {
// //             throw new Error(`Unexpected response status: ${response.status}`);
// //         }
// //     } catch (err) {
// //         console.error('Error publishing template:', err);
// //         let errorMessage = 'Failed to publish template';
// //         if (err.response) {
// //             errorMessage = `Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`;
// //         } else if (err.request) {
// //             errorMessage = 'No response received from server. Please check your network connection.';
// //         } else {
// //             errorMessage = `Error: ${err.message}`;
// //         }
// //         setError(errorMessage);
// //     } finally {
// //         setLoading(false);
// //     }
// // };

// const handlePublish = async () => {
//   try {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('file', new Blob([JSON.stringify(template)], {type: 'application/json'}));

//     const response = await fetch('https://dev.test.neuralix.ai/workspaces/api/usecases', {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Authorization': `Bearer ${user.token}`,
//         'x-nix-wid': user.workspaceId || ''
//       }
//     });

//     if (response.ok) {
//       const publishedTemplate = await response.json();
//       setTemplate(prevTemplate => ({
//         ...prevTemplate,
//         status: 'PUBLISHED',
//         id: publishedTemplate.id
//       }));
//       setSuccessMessage('Template published successfully');
//     } else {
//       throw new Error(`Unexpected response status: ${response.status}`);
//     }
//   } catch (err) {
//     console.error('Error publishing template:', err);
//     setError('Failed to publish template');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleExport = async () => {
//     try {
//       const response = await exportTemplate(id);
//       const blob = new Blob([response.data], { type: 'application/octet-stream' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.displayName}.nixdlt`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError('Failed to export template');
//     }
//   };
  
//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
//   if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography color="error">{error}</Typography></Box>;
//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           <Typography variant="h4">{template.displayName}</Typography>
//           <Button onClick={handleExport} variant="contained" color="primary">Export Template</Button>
//           {editMode ? (
//             <form onSubmit={handleUpdateTemplate}>
//               <TextField fullWidth label="Display Name" value={template.displayName} onChange={(e) => setTemplate({...template, displayName: e.target.value})} margin="normal" />
//               <TextField fullWidth label="Description" multiline rows={4} value={template.description} onChange={(e) => setTemplate({...template, description: e.target.value})} margin="normal" />
//               <TagInput tags={template.tags || []} setTags={handleTagsChange} templateId={id} />
//               <Button type="submit" variant="contained" color="primary">Save</Button>
//               <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
//             </form>
//           ) : (
//             <>
//               <Typography>{template.description}</Typography>
//               <Typography variant="h6">Tags:</Typography>
//               <ul>
//                 {template.tags && template.tags.length > 0 ? (
//                   template.tags.map((tag, index) => (
//                     <li key={index}>{tag}</li>
//                   ))
//                 ) : (
//                   <li>No tags available</li>
//                 )}
//               </ul>
//               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//               <Button onClick={handlePublish} variant="contained" color="secondary">Publish Workspace</Button>
//             </>
//           )}
//           <Typography variant="h5">Resources</Typography>
//           <form onSubmit={handleAddResource}>
//             <TextField value={newResourceName} onChange={(e) => setNewResourceName(e.target.value)} placeholder="Resource Name" />
//             <FormControl fullWidth>
//               <InputLabel>Resource Type</InputLabel>
//               <Select value={newResourceType} onChange={handleResourceTypeChange}>
//                 {Object.keys(defaultConfigs).map((type) => (
//                   <MenuItem key={type} value={type}>{type}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <JsonEditor json={newResourceConfig} onChange={setNewResourceConfig} />
//             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//           </form>
//           {template.resources.map((resource) => (
//             <Box key={resource.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
//               <Typography variant="h6">{resource.name} ({resource.type})</Typography>
//               <ResourceConfig resource={resource} onUpdate={handleUpdateResource} />
//               <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//       <Snackbar
//         open={publishSuccess}
//         autoHideDuration={6000}
//         onClose={() => setPublishSuccess(false)}
//         message="Workspace published successfully"
//       />
//     </Box>
//   );
// }

// export default TemplateDetails;

//working 11/22 5:01
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate, getTemplateVersions } from '../services/api';
// import TagInput from './TagInput';
// import JsonEditor from './JsonEditor';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import JsonDiffView from './JsonDiffView';
// import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar, IconButton } from '@mui/material';

// const defaultConfigs = {
//   DASHBOARD: {
//     key: "",
//     displayName: "",
//     description: "",
//     config: { updateInterval: "5s" },
//     paramsSchema: { type: "object", properties: {}, required: [] },
//     charts: []
//   },
//   DATASTORE: {
//     key: "",
//     displayName: "",
//     description: "",
//     dataSchema: { type: "object", properties: {}, required: [] }
//   },
//   METRIC: {
//     key: "count_of_microseismic_data",
//     displayName: "Count of Microseismic Data",
//     description: "",
//     sql: "SELECT COUNT(*) as count FROM datastore:microseismic WHERE well_id=:well_id",
//     valueSchema: {
//       type: "object",
//       properties: { count: { type: "integer" } },
//       required: ["count"]
//     },
//     paramsSchema: {
//       type: "object",
//       properties: { well_id: { type: "string" } },
//       required: ["well_id"]
//     }
//   },
//   ALERT: {
//     key: "",
//     displayName: "",
//     description: "",
//     metricKey: "",
//     conditions: [],
//     severity: "warning"
//   },
//   FEATURESTORE: {
//     key: "well_trip_classification_feature",
//     displayName: "Well Trip Classification Feature",
//     description: "",
//     sql: "SELECT pressure, timestamp FROM datastore:realtime",
//     checkpoint_fields: ["timestamp"],
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         pressure: {
//           type: "number"
//         }
//       },
//       required: [ "timestamp", "pressure"]
//     }
//   },
//   INFERENCESTORE: {
//     key: "well_trip_classifier",
//     displayName: "Well Trip Classifier Predictions",
//     description: "",
//     dataSchema: {
//       type: "object",
//       properties: {
//         timestamp: {
//           type: "string",
//           format: "date-time",
//           metadata: {
//             isPrimaryKey: true
//           }
//         },
//         state: {
//           type: "string"
//         }
//       },
//       required: [ "timestamp", "state"]
//     }
//   },
//   MODEL: {
//     key: "slope_classification",
//     displayName: "Slope Classification",
//     description: "Classifies a timeseries as NORM ( normal ) or TRIP ( tripping / abnormal ) based on slope",
//     supportsTraining: false,
//     supportsGpu: false
//   }
// };

// const ResourceConfig = ({ resource, onUpdate }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedResource, setEditedResource] = useState(resource);

//   const handleConfigChange = (newConfig) => {
//     setEditedResource(prevResource => ({
//       ...prevResource,
//       config: {
//         ...newConfig,
//         source: prevResource.config.source // Preserve the source config
//       }
//     }));
//   };

//   const handleSourceChange = (field, value) => {
//     setEditedResource(prevResource => ({
//       ...prevResource,
//       config: {
//         ...prevResource.config,
//         source: {
//           ...(prevResource.config.source || {}),
//           [field]: value
//         }
//       }
//     }));
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleSaveClick = () => {
//     onUpdate(resource.id, editedResource);
//     setIsEditing(false);
//   };

//   const renderModelSourceFields = () => {
//     if (resource.type !== 'MODEL') return null;
//     return (
//       <Box className="mt-4">
//         <Typography variant="h6" className="mb-2">Model Source Files</Typography>
//         {['requirements', '__init__', 'config', 'model'].map(field => (
//           <TextField
//             key={field}
//             fullWidth
//             label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
//             multiline
//             rows={4}
//             value={editedResource.config.source?.[field] || ''}
//             onChange={(e) => handleSourceChange(field, e.target.value)}
//             className="mb-4"
//             variant="outlined"
//             disabled={!isEditing}
//           />
//         ))}
//       </Box>
//     );
//   };

//   const configWithoutSource = { ...editedResource.config };
//   delete configWithoutSource.source;

//   return (
//     <Box className="mt-4">
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="h6">{resource.name}</Typography>
//         {isEditing ? (
//           <IconButton onClick={handleSaveClick} color="primary">
//             <SaveIcon />
//           </IconButton>
//         ) : (
//           <IconButton onClick={handleEditClick}>
//             <EditIcon />
//           </IconButton>
//         )}
//       </Box>
//       <JsonEditor 
//         json={configWithoutSource} 
//         onChange={handleConfigChange}
//         readOnly={!isEditing}
//       />
//       {renderModelSourceFields()}
//     </Box>
//   );
// };

// function TemplateDetails({ user, onLogout }) {
//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [newResourceName, setNewResourceName] = useState('');
//   const [newResourceType, setNewResourceType] = useState('');
//   const [newResourceConfig, setNewResourceConfig] = useState({});
//   const [publishSuccess, setPublishSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [versions, setVersions] = useState([]);
//   const [selectedVersion1, setSelectedVersion1] = useState('');
//   const [selectedVersion2, setSelectedVersion2] = useState('');
//   const [showDiff, setShowDiff] = useState(false);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplate();
//     fetchVersions();
//   }, [id]);

//   const fetchVersions = async () => {
//     try {
//         const response = await getTemplateVersions(id);
//         setVersions(response.data);
//         if (response.data.length > 1) {
//             setSelectedVersion1(response.data[response.data.length - 2].version);
//             setSelectedVersion2(response.data[response.data.length - 1].version);
//         }
//     } catch (err) {
//         console.error('Error fetching versions:', err);
//         setError('Failed to fetch template versions');
//     }
// };

//   const fetchTemplate = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplate(id);
//       setTemplate(response.data);
//     } catch (err) {
//       console.error('Error fetching template:', err);
//       setError('Failed to fetch template details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateTemplate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateTemplate(id, template);
//       setEditMode(false);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating template:', err);
//       setError('Failed to update template');
//     }
//   };

//   const handleTagsChange = (newTags) => {
//     setTemplate(prevTemplate => ({ ...prevTemplate, tags: newTags }));
//   };

//   const handleAddResource = async (e) => {
//     e.preventDefault();
//     try {
//       const resourceData = { name: newResourceName, type: newResourceType, config: newResourceConfig };
//       await createResource(id, resourceData);
//       setNewResourceName('');
//       setNewResourceType('');
//       setNewResourceConfig({});
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error adding resource:', err);
//       setError('Failed to add resource');
//     }
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     try {
//       await updateResource(resourceId, resourceData);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error updating resource:', err);
//       setError('Failed to update resource');
//     }
//   };

//   const handleDeleteResource = async (resourceId) => {
//     try {
//       await deleteResource(resourceId);
//       fetchTemplate();
//     } catch (err) {
//       console.error('Error deleting resource:', err);
//       setError('Failed to delete resource');
//     }
//   };


// const handlePublish = async () => {
//   try {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('file', new Blob([JSON.stringify(template)], {type: 'application/json'}));

//     const response = await fetch('https://dev.test.neuralix.ai/workspaces/api/usecases', {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Authorization': `Bearer ${user.token}`,
//         'x-nix-wid': user.workspaceId || ''
//       }
//     });

//     if (response.ok) {
//       const publishedTemplate = await response.json();
//       setTemplate(prevTemplate => ({
//         ...prevTemplate,
//         status: 'PUBLISHED',
//         id: publishedTemplate.id
//       }));
//       setSuccessMessage('Template published successfully');
//     } else {
//       throw new Error(`Unexpected response status: ${response.status}`);
//     }
//   } catch (err) {
//     console.error('Error publishing template:', err);
//     setError('Failed to publish template');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleResourceTypeChange = (e) => {
//     const type = e.target.value;
//     setNewResourceType(type);
//     setNewResourceConfig(defaultConfigs[type] || {});
//   };

//   const handleExport = async () => {
//     try {
//       const response = await exportTemplate(id);
//       const blob = new Blob([response.data], { type: 'application/octet-stream' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${template.displayName}.nixdlt`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError('Failed to export template');
//     }
//   };
  
//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
//   if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography color="error">{error}</Typography></Box>;
//   if (!template) return null;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           <Typography variant="h4">{template.displayName}</Typography>
//           <Button onClick={handleExport} variant="contained" color="primary">Export Template</Button>
//           {editMode ? (
//             <form onSubmit={handleUpdateTemplate}>
//               <TextField fullWidth label="Display Name" value={template.displayName} onChange={(e) => setTemplate({...template, displayName: e.target.value})} margin="normal" />
//               <TextField fullWidth label="Description" multiline rows={4} value={template.description} onChange={(e) => setTemplate({...template, description: e.target.value})} margin="normal" />
//               <TagInput tags={template.tags || []} setTags={handleTagsChange} templateId={id} />
//               <Button type="submit" variant="contained" color="primary">Save</Button>
//               <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
//             </form>
//           ) : (
//             <>
//               <Typography>{template.description}</Typography>
//               <Typography variant="h6">Tags:</Typography>
//               <ul>
//                 {template.tags && template.tags.length > 0 ? (
//                   template.tags.map((tag, index) => (
//                     <li key={index}>{tag}</li>
//                   ))
//                 ) : (
//                   <li>No tags available</li>
//                 )}
//               </ul>
//               <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit</Button>
//               <Button onClick={handlePublish} variant="contained" color="secondary">Publish Workspace</Button>
//             </>
//           )}
//           <Typography variant="h5">Resources</Typography>
//           <form onSubmit={handleAddResource}>
//             <TextField value={newResourceName} onChange={(e) => setNewResourceName(e.target.value)} placeholder="Resource Name" />
//             <FormControl fullWidth>
//               <InputLabel>Resource Type</InputLabel>
//               <Select value={newResourceType} onChange={handleResourceTypeChange}>
//                 {Object.keys(defaultConfigs).map((type) => (
//                   <MenuItem key={type} value={type}>{type}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <JsonEditor json={newResourceConfig} onChange={setNewResourceConfig} />
//             <Button type="submit" variant="contained" color="primary">Add Resource</Button>
//           </form>
//           {template.resources.map((resource) => (
//             <Box key={resource.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
//               <Typography variant="h6">{resource.name} ({resource.type})</Typography>
//               <ResourceConfig resource={resource} onUpdate={handleUpdateResource} onEdit={() => {}} />
//               <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//       <Snackbar
//         open={publishSuccess}
//         autoHideDuration={6000}
//         onClose={() => setPublishSuccess(false)}
//         message="Workspace published successfully"
//       />
//     </Box>
//   );
// }

// export default TemplateDetails;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplate, updateTemplate, createResource, updateResource, deleteResource, publishTemplate, exportTemplate, getTemplateVersions } from '../services/api';
import TagInput from './TagInput';
import JsonEditor from './JsonEditor';
import Sidebar from './Sidebar';
import Header from './Header';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import JsonDiffView from './JsonDiffView';
import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar, IconButton } from '@mui/material';

const defaultConfigs = {
  DASHBOARD: {
    key: "",
    displayName: "",
    description: "",
    config: { updateInterval: "5s" },
    paramsSchema: { type: "object", properties: {}, required: [] },
    charts: []
  },
  DATASTORE: {
    key: "",
    displayName: "",
    description: "",
    dataSchema: { type: "object", properties: {}, required: [] }
  },
  METRIC: {
    key: "count_of_microseismic_data",
    displayName: "Count of Microseismic Data",
    description: "",
    sql: "SELECT COUNT(*) as count FROM datastore:microseismic WHERE well_id=:well_id",
    valueSchema: {
      type: "object",
      properties: { count: { type: "integer" } },
      required: ["count"]
    },
    paramsSchema: {
      type: "object",
      properties: { well_id: { type: "string" } },
      required: ["well_id"]
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
    key: "well_trip_classification_feature",
    displayName: "Well Trip Classification Feature",
    description: "",
    sql: "SELECT pressure, timestamp FROM datastore:realtime",
    checkpoint_fields: ["timestamp"],
    dataSchema: {
      type: "object",
      properties: {
        timestamp: {
          type: "string",
          format: "date-time",
          metadata: {
            isPrimaryKey: true
          }
        },
        pressure: {
          type: "number"
        }
      },
      required: [ "timestamp", "pressure"]
    }
  },
  INFERENCESTORE: {
    key: "well_trip_classifier",
    displayName: "Well Trip Classifier Predictions",
    description: "",
    dataSchema: {
      type: "object",
      properties: {
        timestamp: {
          type: "string",
          format: "date-time",
          metadata: {
            isPrimaryKey: true
          }
        },
        state: {
          type: "string"
        }
      },
      required: [ "timestamp", "state"]
    }
  },
  MODEL: {
    key: "slope_classification",
    displayName: "Slope Classification",
    description: "Classifies a timeseries as NORM ( normal ) or TRIP ( tripping / abnormal ) based on slope",
    supportsTraining: false,
    supportsGpu: false
  }
};

const ResourceConfig = ({ resource, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResource, setEditedResource] = useState(resource);

  const handleConfigChange = (newConfig) => {
    setEditedResource(prevResource => ({
      ...prevResource,
      config: {
        ...newConfig,
        source: prevResource.config.source // Preserve the source config
      }
    }));
  };

  const handleSourceChange = (field, value) => {
    setEditedResource(prevResource => ({
      ...prevResource,
      config: {
        ...prevResource.config,
        source: {
          ...(prevResource.config.source || {}),
          [field]: value
        }
      }
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onUpdate(resource.id, editedResource);
    setIsEditing(false);
  };

  const renderModelSourceFields = () => {
    if (resource.type !== 'MODEL') return null;
    return (
      <Box className="mt-4">
        <Typography variant="h6" className="mb-2">Model Source Files</Typography>
        {['requirements', '__init__', 'config', 'model'].map(field => (
          <TextField
            key={field}
            fullWidth
            label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
            multiline
            rows={4}
            value={editedResource.config.source?.[field] || ''}
            onChange={(e) => handleSourceChange(field, e.target.value)}
            className="mb-4"
            variant="outlined"
            disabled={!isEditing}
          />
        ))}
      </Box>
    );
  };

  const configWithoutSource = { ...editedResource.config };
  delete configWithoutSource.source;

  return (
    <Box className="mt-4">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{resource.name}</Typography>
        {isEditing ? (
          <IconButton onClick={handleSaveClick} color="primary">
            <SaveIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <JsonEditor 
        json={configWithoutSource} 
        onChange={handleConfigChange}
        readOnly={!isEditing}
      />
      {renderModelSourceFields()}
    </Box>
  );
};

function TemplateDetails({ user, onLogout }) {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState('');
  const [newResourceConfig, setNewResourceConfig] = useState({});
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [versions, setVersions] = useState([]);
  const [selectedVersion1, setSelectedVersion1] = useState('');
  const [selectedVersion2, setSelectedVersion2] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplate();
    fetchVersions();
  }, [id]);

  const fetchVersions = async () => {
    try {
        const response = await getTemplateVersions(id);
        setVersions(response.data);
        if (response.data.length > 1) {
            setSelectedVersion1(response.data[response.data.length - 2].version);
            setSelectedVersion2(response.data[response.data.length - 1].version);
        }
    } catch (err) {
        console.error('Error fetching versions:', err);
        setError('Failed to fetch template versions');
    }
};

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await getTemplate(id);
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
      await updateTemplate(id, template);
      setEditMode(false);
      fetchTemplate();
    } catch (err) {
      console.error('Error updating template:', err);
      setError('Failed to update template');
    }
  };

  const handleTagsChange = (newTags) => {
    setTemplate(prevTemplate => ({ ...prevTemplate, tags: newTags }));
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const resourceData = { name: newResourceName, type: newResourceType, config: newResourceConfig };
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
    setLoading(true);
    const formData = new FormData();
    formData.append('file', new Blob([JSON.stringify(template)], {type: 'application/json'}));

    const response = await fetch('https://dev.test.neuralix.ai/workspaces/api/usecases', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'x-nix-wid': user.workspaceId || ''
      }
    });

    if (response.ok) {
      const publishedTemplate = await response.json();
      setTemplate(prevTemplate => ({
        ...prevTemplate,
        status: 'PUBLISHED',
        id: publishedTemplate.id
      }));
      setSuccessMessage('Template published successfully');
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (err) {
    console.error('Error publishing template:', err);
    setError('Failed to publish template');
  } finally {
    setLoading(false);
  }
};

  const handleResourceTypeChange = (e) => {
    const type = e.target.value;
    setNewResourceType(type);
    setNewResourceConfig(defaultConfigs[type] || {});
  };

  const handleExport = async () => {
    try {
      const response = await exportTemplate(id);
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${template.displayName}.nixdlt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export template');
    }
  };
  
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography color="error">{error}</Typography></Box>;
  if (!template) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header user={user} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar onDashboardClick={() => navigate('/')} onLogout={onLogout} />
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Typography variant="h4">{template.displayName}</Typography>
          <Button onClick={handleExport} variant="contained" color="primary">Export Template</Button>
          <Box mt={4}>
        <Typography variant="h5">Version Control</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Version 1</InputLabel>
            <Select
              value={selectedVersion1}
              onChange={(e) => setSelectedVersion1(e.target.value)}
            >
              {versions.map((version) => (
                <MenuItem key={version.version} value={version.version}>
                  Version {version.version} - {new Date(version.created_at).toLocaleString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Version 2</InputLabel>
            <Select
              value={selectedVersion2}
              onChange={(e) => setSelectedVersion2(e.target.value)}
            >
              {versions.map((version) => (
                <MenuItem key={version.version} value={version.version}>
                  Version {version.version} - {new Date(version.created_at).toLocaleString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button 
          sx={{ mt: 2 }}
          variant="contained" 
          onClick={() => setShowDiff(!showDiff)}
          disabled={!selectedVersion1 || !selectedVersion2}
        >
          {showDiff ? 'Hide Diff' : 'Show Diff'}
        </Button>
        {showDiff && selectedVersion1 && selectedVersion2 && (
          <JsonDiffView 
            templateId={id} 
            version1={selectedVersion1} 
            version2={selectedVersion2} 
          />
        )}
      </Box>
          {editMode ? (
            <form onSubmit={handleUpdateTemplate}>
              <TextField fullWidth label="Display Name" value={template.displayName} onChange={(e) => setTemplate({...template, displayName: e.target.value})} margin="normal" />
              <TextField fullWidth label="Description" multiline rows={4} value={template.description} onChange={(e) => setTemplate({...template, description: e.target.value})} margin="normal" />
              <TagInput tags={template.tags || []} setTags={handleTagsChange} templateId={id} />
              <Button type="submit" variant="contained" color="primary">Save</Button>
              <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
            </form>
          ) : (
            <>
              <Typography>{template.description}</Typography>
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
              <Button onClick={handlePublish} variant="contained" color="secondary">Publish Workspace</Button>
            </>
          )}
          <Typography variant="h5">Resources</Typography>
          <form onSubmit={handleAddResource}>
            <TextField value={newResourceName} onChange={(e) => setNewResourceName(e.target.value)} placeholder="Resource Name" />
            <FormControl fullWidth>
              <InputLabel>Resource Type</InputLabel>
              <Select value={newResourceType} onChange={handleResourceTypeChange}>
                {Object.keys(defaultConfigs).map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <JsonEditor json={newResourceConfig} onChange={setNewResourceConfig} />
            <Button type="submit" variant="contained" color="primary">Add Resource</Button>
          </form>
          {template.resources.map((resource) => (
            <Box key={resource.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">{resource.name} ({resource.type})</Typography>
              <ResourceConfig resource={resource} onUpdate={handleUpdateResource} onEdit={() => {}} />
              <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error">Delete</Button>
            </Box>
          ))}
        </Box>
      </Box>
      <Snackbar
        open={publishSuccess}
        autoHideDuration={6000}
        onClose={() => setPublishSuccess(false)}
        message="Workspace published successfully"
      />
    </Box>
  );
}

export default TemplateDetails;



