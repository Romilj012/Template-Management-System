import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogContentText, IconButton, Box, Typography, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

function ChatbotIcon() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const guideContent = [
    {
      title: "Template Creation",
      content: "Create new templates by defining a collection of resources. Each resource supports custom JSON configurations."
    },
    {
      title: "Resource Management",
      content: "Add resources using the 'Add New Resource' form. Specify resource name, type, and configure JSON settings using the built-in editor."
    },
    {
      title: "Template Publishing",
      content: "Publish templates to the DLT platform using the 'Publish Workspace' button. All configurations are validated before publishing."
    },
    {
      title: "Version Control",
      content: "Track changes using the version control feature. Compare different versions using the diff view to see modifications."
    },
    {
      title: "Import/Export",
      content: "Share templates by exporting them as .nixdlt files. Import existing templates to reuse configurations."
    }
  ];

  return (
    <>
      <Fab
        color="secondary"
        aria-label="chat"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Template Editor Guide</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {guideContent.map((section, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {section.title}
              </Typography>
              <DialogContentText>
                {section.content}
              </DialogContentText>
              {index < guideContent.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChatbotIcon;
