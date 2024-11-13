import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import TemplateList from './TemplateList';
import TemplateDetails from './TemplateDetails';
import ChatbotIcon from './ChatbotIcon';

function Dashboard({ user, onLogout }) {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Template 1', description: 'Description for Template 1', resources: ['Resource 1', 'Resource 2'] },
    { id: 2, name: 'Template 2', description: 'Description for Template 2', resources: ['Resource 3', 'Resource 4'] },
    { id: 3, name: 'Template 3', description: 'Description for Template 3', resources: ['Resource 5', 'Resource 6'] },
  ]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const handleDashboardClick = () => {
    setSelectedTemplateId(null);
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleUpdateResources = (templateId, updatedResources) => {
    setTemplates(prevTemplates =>
      prevTemplates.map(template =>
        template.id === templateId ? { ...template, resources: updatedResources } : template
      )
    );
  };

  const handleAddTemplate = (newTemplate) => {
    const newId = Math.max(...templates.map(t => t.id), 0) + 1;
    const templateWithId = { ...newTemplate, id: newId };
    setTemplates(prevTemplates => [...prevTemplates, templateWithId]);
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== templateId));
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null);
    }
  };

  const selectedTemplate = templates.find(template => template.id === selectedTemplateId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header user={user} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar onDashboardClick={handleDashboardClick} onLogout={onLogout} />
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          {selectedTemplate ? (
            <TemplateDetails
              template={selectedTemplate}
              onEdit={() => console.log('Edit template')}
              onDelete={() => handleDeleteTemplate(selectedTemplateId)}
              onPublish={() => console.log('Publish template')}
              onUpdateResources={handleUpdateResources}
              onBackToDashboard={handleDashboardClick}
            />
          ) : (
            <TemplateList 
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
              onAddTemplate={handleAddTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          )}
        </Box>
        <ChatbotIcon />
      </Box>
    </Box>
  );
}

export default Dashboard;