import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Components/CommonComponents/Layout';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

const PrivateRoute: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>('loading');

  useEffect(() => {
    // Llama a tu endpoint que devuelve el ID del profesional si la cookie JWT es válida
    axios
      .get<number>('/experiments/by-token/token')
      .then(({ data }) => {
        if (typeof data === 'number') {
          setAuth('authenticated');
        } else {
          setAuth('unauthenticated');
        }
      })
      .catch(() => {
        setAuth('unauthenticated');
      });
  }, []);

  if (auth === 'loading') {
    // Mientras comprobamos la cookie, podemos mostrar un spinner o null
    return <div>Loading…</div>;
  }
  if (auth === 'unauthenticated') {
    // Si no hay sesión, redirige al login
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, renderizamos el layout y dentro de éste el <Outlet/>
  return <Layout />;
};

export default PrivateRoute;
