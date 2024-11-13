import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function EditResourcesModal({ open, onClose, resources, onSave }) {
  const [editedResources, setEditedResources] = useState([...resources]);
  const [newResource, setNewResource] = useState('');

  const handleAddResource = () => {
    if (newResource.trim()) {
      setEditedResources([...editedResources, newResource.trim()]);
      setNewResource('');
    }
  };

  const handleRemoveResource = (index) => {
    setEditedResources(editedResources.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(editedResources);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Resources</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="Add Resource"
            value={newResource}
            onChange={(e) => setNewResource(e.target.value)}
            fullWidth
          />
          <IconButton onClick={handleAddResource} color="primary">
            <AddIcon />
          </IconButton>
        </Box>
        <List>
          {editedResources.map((resource, index) => (
            <ListItem key={index}>
              <ListItemText primary={resource} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveResource(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditResourcesModal;