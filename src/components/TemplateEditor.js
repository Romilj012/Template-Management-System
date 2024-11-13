import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TemplateEditor() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Template Name</Typography>
      <Tabs value={value} onChange={handleChange} aria-label="template editor tabs">
        <Tab label="Resources" />
        <Tab label="Configuration" />
        <Tab label="Version History" />
      </Tabs>
      <TabPanel value={value} index={0}>
        List of resources in the template
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          label="JSON Configuration"
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Version history and diff view
      </TabPanel>
    </Box>
  );
}

export default TemplateEditor;