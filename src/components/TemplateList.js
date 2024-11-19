import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTemplates, createTemplate } from '../services/api';
import { Button, List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';

function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await getTemplates();
      setTemplates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch templates');
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const newTemplate = {
        name: 'New Template',
        description: 'Template description',
        tags: [],
        status: 'DRAFT'
      };
      const response = await createTemplate(newTemplate);
      setTemplates([...templates, response.data]);
    } catch (err) {
      setError('Failed to create template');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Templates</Typography>
      <Button variant="contained" color="primary" onClick={handleCreateTemplate}>
        Create New Template
      </Button>
      <List>
        {templates.map(template => (
          <ListItem key={template.id} button component={Link} to={`/templates/${template.id}`}>
            <ListItemText primary={template.name} secondary={template.status} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default TemplateList;
