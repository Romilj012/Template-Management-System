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
import { Box, Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar, IconButton, Chip } from '@mui/material';


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
      required: ["timestamp", "pressure"]
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
      required: ["timestamp", "state"]
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
      displayName: newConfig.displayName || prevResource.displayName,
      config: {
        ...newConfig,
        source: prevResource.config.source
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
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Model Source Files</Typography>
        {['requirements', '__init__', 'config', 'model'].map(field => (
          <TextField
            key={field}
            fullWidth
            label={`${field}${field === 'requirements' ? '.txt' : '.py'}`}
            multiline
            rows={4}
            value={editedResource.config.source?.[field] || ''}
            onChange={(e) => handleSourceChange(field, e.target.value)}
            sx={{ mb: 2 }}
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
    <Box sx={{ mt: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h6">{editedResource.displayName}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={resource.type}
            color="primary"
            variant="outlined"
            size="small"
          />
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
      navigate('/dashboard');
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
    if (!newResourceName.trim()) {
      setError('Resource name is required');
      return;
    }
    try {
      const resourceData = {
        displayName: newResourceName,
        type: newResourceType,
        config: {
          ...newResourceConfig,
          displayName: newResourceName
        }
      };
      await createResource(id, resourceData);
      setNewResourceName('');
      setNewResourceType('');
      setNewResourceConfig({});
      setError(null); // Clear any existing error
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
        const xNixWid = localStorage.getItem('workspaceId');
  
        const templatePackage = {
            id: template.id,
            displayName: template.displayName,
            description: template.description,
            tags: template.tags,
            resources: template.resources.map(resource => ({
                displayName: resource.displayName,
                type: resource.type,
                config: resource.config
            }))
        };

        const response = await publishTemplate(template.id, xNixWid, templatePackage);
        
        setTemplate(prevTemplate => ({
            ...prevTemplate,
            status: 'PUBLISHED',
            published_url: response.data?.published_url
        }));
        
        setSuccessMessage('Template published successfully');
        setPublishSuccess(true);

        await fetchTemplate();
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
    setNewResourceConfig({
      ...defaultConfigs[type],
      displayName: newResourceName 
    });
  };

  useEffect(() => {
    if (newResourceName && newResourceType) {
      setNewResourceConfig(prevConfig => ({
        ...prevConfig,
        displayName: newResourceName
      }));
    }
  }, [newResourceName]);


  const handleExport = async () => {
    try {
      const response = await exportTemplate(id);
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${template.displayName}.zip`);
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
        <Box sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">{template.displayName}</Typography>
            <Button onClick={handleExport} variant="contained" color="primary">Export Template</Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Description</Typography>
            <Typography variant="body1">{template.description}</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Tags</Typography>
            {template.tags && template.tags.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {template.tags.map((tag, index) => (
                  <Chip key={index} label={tag} />
                ))}
              </Box>
            ) : (
              <Typography>No tags available</Typography>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Version Control</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
              variant="contained"
              onClick={() => setShowDiff(!showDiff)}
              disabled={!selectedVersion1 || !selectedVersion2}
            >
              {showDiff ? 'Hide Diff' : 'Show Diff'}
            </Button>
            {showDiff && selectedVersion1 && selectedVersion2 && (
              <Box sx={{ mt: 2 }}>
                <JsonDiffView
                  templateId={id}
                  version1={selectedVersion1}
                  version2={selectedVersion2}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Template Actions</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit Template</Button>
              <Button onClick={handlePublish} variant="contained" color="secondary">Publish Workspace</Button>
            </Box>
          </Box>

          {editMode && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>Edit Template</Typography>
              <form onSubmit={handleUpdateTemplate}>
                <TextField fullWidth label="Display Name" value={template.displayName} onChange={(e) => setTemplate({ ...template, displayName: e.target.value })} margin="normal" />
                <TextField fullWidth label="Description" multiline rows={4} value={template.description} onChange={(e) => setTemplate({ ...template, description: e.target.value })} margin="normal" />
                <Box sx={{ mb: 4 }}>
  <Typography variant="h5" gutterBottom>Status</Typography>
  <Chip 
    label={template.status || 'DRAFT'}
    color={template.status === 'PUBLISHED' ? 'success' : 'default'}
    variant="outlined"
  />
</Box>
                <TagInput tags={template.tags || []} setTags={handleTagsChange} templateId={id} />
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained" color="primary">Save</Button>
                  <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
                </Box>
              </form>
            </Box>
          )}

          <Box>
            <Typography variant="h5" gutterBottom>Resources</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Add New Resource</Typography>
              <form onSubmit={handleAddResource}>
                <TextField
                  required
                  fullWidth
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                  placeholder="Resource Name"
                  margin="normal"
                  error={!newResourceName}
                  helperText={!newResourceName && "Resource name is required"}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Resource Type</InputLabel>
                  <Select
                    value={newResourceType}
                    onChange={handleResourceTypeChange}
                  >
                    {Object.keys(defaultConfigs).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <JsonEditor
                  json={newResourceConfig}
                  onChange={setNewResourceConfig}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  disabled={!newResourceName}
                >
                  Add Resource
                </Button>
              </form>
            </Box>
            {template.resources.map((resource) => (
              <Box key={resource.id} sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <ResourceConfig resource={resource} onUpdate={handleUpdateResource} />
                <Button onClick={() => handleDeleteResource(resource.id)} variant="outlined" color="error" sx={{ mt: 2 }}>Delete Resource</Button>
              </Box>
            ))}
          </Box>
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
