import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, roles }) => {
  const accountId = localStorage.getItem('id');
  const userRole = localStorage.getItem('role');


  if (!accountId || !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default PrivateRoute;
