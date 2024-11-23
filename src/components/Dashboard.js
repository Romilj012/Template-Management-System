// import React, { useState, useEffect } from 'react';
// import { Box, CircularProgress, Snackbar } from '@mui/material';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import TemplateList from './TemplateList';
// import TemplateDetails from './TemplateDetails';
// import ChatbotIcon from './ChatbotIcon';
// import { getTemplates } from '../services/api';

// function Dashboard({ user, onLogout }) {
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplateId, setSelectedTemplateId] = useState(null);
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
//     } catch (err) {
//       setError('Failed to fetch templates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDashboardClick = () => {
//     setSelectedTemplateId(null);
//   };

//   const handleSelectTemplate = (templateId) => {
//     setSelectedTemplateId(templateId);
//   };

//   const handleUpdateResources = async (templateId, updatedResources) => {
//     console.log(`Update resources for template ${templateId}`, updatedResources);
//     fetchTemplates(); 
//   };

//   const selectedTemplate = templates.find(template => template.id === selectedTemplateId);

//   if (loading) return <CircularProgress />;
  
//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar onDashboardClick={handleDashboardClick} onLogout={onLogout} />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           {selectedTemplate ? (
//             <TemplateDetails
//               templateId={selectedTemplate.id}
//               onDelete={(id) => console.log('Delete template', id)} 
//               onUpdateResources={handleUpdateResources}
//             />
//           ) : (
//             <TemplateList 
//               templates={templates}
//               onSelectTemplate={handleSelectTemplate}
//               onAddTemplate={(newTemplate) => console.log('Add new template', newTemplate)} 
//               onDeleteTemplate={(id) => console.log('Delete template', id)}
//             />
//           )}
//         </Box>
//         <ChatbotIcon />
//       </Box>
//       {error && (
//         <Snackbar 
//           open={!!error} 
//           autoHideDuration={6000} 
//           message={error} 
//           onClose={() => setError(null)} 
//         />
//       )}
//     </Box>
//   );
// }

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Snackbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import TemplateList from './TemplateList';
import TemplateDetails from './TemplateDetails';
import ChatbotIcon from './ChatbotIcon';
import { getTemplates } from '../services/api';

function Dashboard({ user, onLogout }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
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
    } catch (err) {
      setError('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardClick = () => {
    setSelectedTemplateId(null);
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleImportSuccess = (importedTemplate) => {
    setTemplates([...templates, importedTemplate]);
    setSelectedTemplateId(importedTemplate.id);
  };

  const selectedTemplate = templates.find(template => template.id === selectedTemplateId);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header user={user} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar 
          onDashboardClick={handleDashboardClick} 
          onLogout={onLogout}
          onImportSuccess={handleImportSuccess}
        />
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          {selectedTemplate ? (
            <TemplateDetails 
              templateId={selectedTemplate.id} 
              onDelete={(id) => console.log('Delete template', id)} 
            />
          ) : (
            <TemplateList 
              templates={templates} 
              onSelectTemplate={handleSelectTemplate} 
            />
          )}
        </Box>
        <ChatbotIcon />
      </Box>
      {error && (
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
    </Box>
  );
}

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { Box, CircularProgress, Snackbar } from '@mui/material';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import TemplateList from './TemplateList';
// import TemplateDetails from './TemplateDetails';
// import ChatbotIcon from './ChatbotIcon';
// import { getTemplates } from '../services/api';

// function Dashboard({ user, onLogout }) {
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplateId, setSelectedTemplateId] = useState(null);
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
//     } catch (err) {
//       setError('Failed to fetch templates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDashboardClick = () => {
//     setSelectedTemplateId(null);
//   };

//   const handleSelectTemplate = (templateId) => {
//     setSelectedTemplateId(templateId);
//   };

//   const handleImportSuccess = (importedTemplate) => {
//     setTemplates([...templates, importedTemplate]);
//     setSelectedTemplateId(importedTemplate.id);
//   };

//   const selectedTemplate = templates.find(template => template.id === selectedTemplateId);

//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Header user={user} />
//       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
//         <Sidebar 
//           onDashboardClick={handleDashboardClick} 
//           onLogout={onLogout}
//           onImportSuccess={handleImportSuccess}
//         />
//         <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
//           {selectedTemplate ? (
//             <TemplateDetails 
//               templateId={selectedTemplate.id} 
//               onDelete={(id) => console.log('Delete template', id)} 
//             />
//           ) : (
//             <TemplateList 
//               templates={templates} 
//               onSelectTemplate={handleSelectTemplate} 
//             />
//           )}
//         </Box>
//         <ChatbotIcon />
//       </Box>
//       {error && (
//         <Snackbar 
//           open={!!error} 
//           autoHideDuration={6000} 
//           message={error} 
//           onClose={() => setError(null)} 
//         />
//       )}
//     </Box>
//   );
// }

// export default Dashboard;