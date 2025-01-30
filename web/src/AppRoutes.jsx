import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Account/Login/Login';
import SignUp from './Components/Account/SignUp/SignUp';
import Home from './pages/Home/Home';
import { useAuth } from './Components/Account/AuthContext';
import Introduce from './pages/Introduce/Introduce';
import ContactPage from './pages/Question/ContactPage';
import News from './pages/News/News'
import NewDetail from './pages/News/NewDetail';
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Introduce" element={<Introduce />} />
      <Route path="/News" element={<News />} />
      <Route path="/news/:id" element={<NewDetail />} />
      <Route path="/ContactPage" element={<ContactPage />} />
      <Route path="/account/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/account/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
      {/* Add other routes as necessary */}
    </Routes>
  );
};

export default AppRoutes;
