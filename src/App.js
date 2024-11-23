import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import TemplateList from './components/TemplateList';
import TemplateDetails from './components/TemplateDetails';
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
      <Router>
        <Routes>
          {!user ? (
            <>
              <Route 
                path="/login" 
                element={
                  <Login 
                    onLogin={handleLogin} 
                    onSwitchToSignup={() => setIsLoginView(false)} 
                  />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <Signup 
                    onSignup={handleSignup} 
                    onSwitchToLogin={() => setIsLoginView(true)} 
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route 
                path="/" 
                element={<Dashboard user={user} onLogout={handleLogout} />} 
              />
              <Route path="/templates" element={<TemplateList />} />
              <Route path="/templates/:id" element={<TemplateDetails user={user} onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;


