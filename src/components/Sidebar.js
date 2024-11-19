import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Sidebar({ onDashboardClick, onLogout }) {
  const handleImport = () => {
    // import logic here
    console.log("Import bundle file");
  };

  return (
    <Box sx={{ width: 240, flexShrink: 0, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List>
        <ListItem button onClick={onDashboardClick}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Templates" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleImport}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <CloudUploadIcon />
          </ListItemIcon>
          <ListItemText primary="Import Template" />
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem button onClick={onLogout}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;
