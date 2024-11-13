import React from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

function ChatbotIcon() {
  return (
    <Fab
      color="secondary"
      aria-label="chat"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
      }}
    >
      <ChatIcon />
    </Fab>
  );
}

export default ChatbotIcon;