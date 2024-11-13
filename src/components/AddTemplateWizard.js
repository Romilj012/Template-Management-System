import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const steps = ['Template Details', 'Resources'];

function AddTemplateWizard({ open, onClose, onSave }) {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddResource = () => {
    if (newResource.trim()) {
      setResources([...resources, newResource.trim()]);
      setNewResource('');
    }
  };

  const handleRemoveResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ name, description, resources });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Template</DialogTitle>
      <DialogContent>
        <Box display="flex">
          <Box width="200px" mr={4}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box flex={1}>
            {activeStep === 0 ? (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Template Name"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Description"
                  type="text"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </>
            ) : (
              <>
                <Typography variant="h6">Resources</Typography>
                <Box display="flex" alignItems="center" mt={1}>
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
                  {resources.map((resource, index) => (
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
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="primary">
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} color="primary" variant="contained">
            Next
          </Button>
        ) : (
          <Button onClick={handleSave} color="primary" variant="contained">
            Create Template
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AddTemplateWizard;