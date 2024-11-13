import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import EditResourcesModal from './EditResourcesModal';

function TemplateDetails({ template, onEdit, onDelete, onPublish, onUpdateResources }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localTemplate, setLocalTemplate] = useState(template);

  const handleEditResources = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveResources = (updatedResources) => {
    const updatedTemplate = { ...localTemplate, resources: updatedResources };
    setLocalTemplate(updatedTemplate);
    onUpdateResources(template.id, updatedResources);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">{localTemplate.name}</Typography>
          <Box>
            <Button startIcon={<EditIcon />} onClick={handleEditResources} sx={{ mr: 1 }}>
              Edit
            </Button>
            <Button startIcon={<DeleteIcon />} onClick={onDelete} sx={{ mr: 1 }}>
              Delete
            </Button>
            <Button variant="contained" startIcon={<PublishIcon />} onClick={onPublish}>
              Publish
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          {localTemplate.description}
        </Typography>
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Resources
        </Typography>
        <List>
          {localTemplate.resources.map((resource, index) => (
            <ListItem key={index}>
              <ListItemText primary={resource} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <EditResourcesModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resources={localTemplate.resources}
        onSave={handleSaveResources}
      />
    </Box>
  );
}

export default TemplateDetails;