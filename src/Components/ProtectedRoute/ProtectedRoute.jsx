import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;