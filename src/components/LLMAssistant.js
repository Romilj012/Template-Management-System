import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function LLMAssistant() {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>LLM Assistant</Typography>
      <TextField
        fullWidth
        label="Ask for assistance"
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth sx={{ mb: 2 }}>
        Get Suggestion
      </Button>
      <Typography variant="body2">AI suggestions</Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="secondary" fullWidth sx={{ mb: 2 }}>
          Publish Template
        </Button>
        <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
          Export Template
        </Button>
        <Button variant="outlined" color="error" fullWidth>
          Delete Template
        </Button>
      </Box>
    </Box>
  );
}

export default LLMAssistant;