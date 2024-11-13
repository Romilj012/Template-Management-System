import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTemplateWizard from './AddTemplateWizard';

function TemplateList({ templates, onSelectTemplate, onAddTemplate, onDeleteTemplate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddTemplate = (newTemplate) => {
    onAddTemplate(newTemplate);
    setIsAddWizardOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Templates</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setIsAddWizardOpen(true)}
        >
          Add Template
        </Button>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search templates..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card onClick={() => onSelectTemplate(template.id)} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">{template.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </Box>
                  <IconButton 
                    aria-label="delete" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTemplate(template.id);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <AddTemplateWizard
        open={isAddWizardOpen}
        onClose={() => setIsAddWizardOpen(false)}
        onSave={handleAddTemplate}
      />
    </Box>
  );
}

export default TemplateList;