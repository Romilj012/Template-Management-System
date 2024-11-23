import React from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function TemplateManagement() {
  const templates = [
    { name: 'Template 1', lastModified: '2024-11-07', status: 'Draft' },
    { name: 'Template 2', lastModified: '2024-11-06', status: 'Published' },
  ];

  return (
    <Box>
      <Button variant="contained" startIcon={<AddIcon />} fullWidth sx={{ mb: 2 }}>
        Create New Template
      </Button>
      <List>
        {templates.map((template, index) => (
          <ListItem key={index} sx={{ border: 1, borderColor: 'grey.300', mb: 1 }}>
            <ListItemText
              primary={template.displayName}
              secondary={
                <React.Fragment>
                  <Typography variant="body2" component="span">
                    Last modified: {template.lastModified}
                  </Typography>
                  <br />
                  <Typography variant="body2" component="span">
                    Status: {template.status}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" fullWidth>
        Import Template
      </Button>
    </Box>
  );
}

export default TemplateManagement;