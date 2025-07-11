import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If roles are required and the user's role is not included, redirect to home.
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;