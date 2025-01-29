import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, Paper, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { signup } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

const Logo = styled('img')({
  width: 120,
  marginBottom: 16,
});

const CompanyName = styled(Typography)(({ theme }) => ({
  '& .highlight': {
    color: theme.palette.primary.main,
  },
}));

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/login');
    } catch (error) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Logo src={`${process.env.PUBLIC_URL}/TemplateEditorIcon.webp`} alt="Template Editor Icon" />
      <CompanyName variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        AI Template<span className="highlight"> Editor</span>
      </CompanyName>
      <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 2 }}>
        Sign up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
          name="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Link href="/login" variant="body2" sx={{ textAlign: 'center', display: 'block' }}>
          Already have an account? Log in
        </Link>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />
    </StyledPaper>
  );
}

export default Signup;
