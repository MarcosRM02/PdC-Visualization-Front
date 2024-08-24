import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('accessToken');
  const expiresIn = localStorage.getItem('expiresIn');

  if (!token || !expiresIn || new Date().getTime() >= parseInt(expiresIn)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
