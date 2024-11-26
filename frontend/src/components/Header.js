import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import { AuthContext } from './AuthContext';

const CompanyName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  '& .highlight': {
    color: '#00DDB9',
  },
}));

function Header({ onLogout }) {
  const { user } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={`${process.env.PUBLIC_URL}/neuralix-logo.jpg`} 
            alt="Neuralix Logo" 
            style={{ height: '40px', marginRight: '10px' }} 
          />
          <Box>
            <CompanyName variant="h6" component="div">
              neural<span className="highlight">ix.ai</span>
            </CompanyName>
            <Typography variant="caption" component="div">
              Template Editor
            </Typography>
          </Box>
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.name}
            </Typography>
            <IconButton color="inherit" onClick={onLogout}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;