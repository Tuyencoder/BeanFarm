import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './Components/Account/AuthContext';
import AppRoutes from './AppRoutes';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { ConfirmProvider } from 'material-ui-confirm';
import CustomerRoutes from './CustomerRoutes';
import AdminRoutes from './AdminRoutes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ConfirmProvider>
          <Router>
            <div>
              <ToastContainer position="bottom-left" theme="colored" />
              <Routes>
                <Route path="/*" element={<AppRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/customer/*" element={<CustomerRoutes />} />
              </Routes>
            </div>
          </Router>
        </ConfirmProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
