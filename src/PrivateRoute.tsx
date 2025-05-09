import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Components/CommonComponents/Layout';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('accessToken');
  const expiresIn = localStorage.getItem('expiresIn');

  // Verifica token
  if (!token || !expiresIn || new Date().getTime() >= parseInt(expiresIn)) {
    return <Navigate to="/" replace />;
  }
  return <Layout />;
};

export default PrivateRoute;
