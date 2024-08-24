import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Borrar los tokens del localStorage y sessionStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');
    sessionStorage.clear(); // Opcional: Borra también todo el sessionStorage si es necesario

    // Redirigir a la ventana de login
    navigate('/', { replace: true });
  };

  return (
    <div className="flex justify-end">
      {' '}
      {/* Contenedor para alinear a la derecha */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
