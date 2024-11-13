import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import theme from './theme';

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLogin = (email, password) => {
    // To make an API call to authenticate the user
    // For this example, I just set a dummy user
    setUser({ id: 1, name: 'Romil Jain', email: email });
  };

  const handleSignup = (name, email, password) => {
    // To make an API call to create a new user
    // For this example, I just set a dummy user
    setUser({ id: 1, name: name, email: email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoginView ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setIsLoginView(false)} />
        ) : (
          <Signup onSignup={handleSignup} onSwitchToLogin={() => setIsLoginView(true)} />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard user={user} onLogout={handleLogout} />
    </ThemeProvider>
  );
}

export default App;