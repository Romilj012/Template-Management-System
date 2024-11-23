// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getTemplates, createTemplate } from '../services/api';
// import { Button, List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';

// function TemplateList() {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   const fetchTemplates = async () => {
//     try {
//       setLoading(true);
//       const response = await getTemplates();
//       setTemplates(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch templates');
//       setLoading(false);
//     }
//   };

//   const handleCreateTemplate = async () => {
//     try {
//       const newTemplate = {
//         name: 'New Template',
//         description: 'Template description',
//         tags: [],
//         status: 'DRAFT'
//       };
//       const response = await createTemplate(newTemplate);
//       setTemplates([...templates, response.data]);
//     } catch (err) {
//       setError('Failed to create template');
//     }
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>Templates</Typography>
//       <Button variant="contained" color="primary" onClick={handleCreateTemplate}>
//         Create New Template
//       </Button>
//       <List>
//         {templates.map(template => (
//           <ListItem key={template.id} button component={Link} to={`/templates/${template.id}`}>
//             <ListItemText primary={template.name} secondary={template.status} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );
// }

// export default TemplateList;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTemplates, createTemplate, deleteTemplate } from '../services/api';
import { Button, Typography, CircularProgress, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        displayName: 'New Template',
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

  const handleDeleteTemplate = async (id) => {
    try {
      await deleteTemplate(id);
      setTemplates(templates.filter(template => template.id !== id));
    } catch (err) {
      setError('Failed to delete template');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Templates</Typography>
      <Button variant="contained" color="primary" onClick={handleCreateTemplate} style={{ marginBottom: '20px' }}>
        Create New Template
      </Button>
      <Grid container spacing={3}>
        {templates.map(template => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {template.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {template.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/templates/${template.id}`)}>
                  View Details
                </Button>
                <IconButton aria-label="delete" onClick={() => handleDeleteTemplate(template.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default TemplateList;