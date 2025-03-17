import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaFolderOpen, FaUserFriends } from 'react-icons/fa';

interface LeftBarProps {
  selectedPanel: string | null;
  togglePanel: (panelId: string) => void;
}

const LeftBar: React.FC<LeftBarProps> = ({ selectedPanel, togglePanel }) => {
  const navigate = useNavigate();
  const professionalId = localStorage.getItem('id');
  return (
    <div className="bg-gray-800 text-white w-16 flex flex-col items-center py-4">
      {/* Botón Home */}
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded 
          ${selectedPanel === 'home' ? 'bg-gray-700' : ''}
        `}
        onClick={() => {
          togglePanel('home');
          navigate(`/experiments/by-professional/${professionalId}`); // Ajusta la ruta según tu necesidad
        }}
      >
        <FaHome />
      </button>

      {/* Botón Proyectos */}
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded 
          ${selectedPanel === 'proyectos' ? 'bg-gray-700' : ''}
        `}
        onClick={() => togglePanel('proyectos')}
      >
        <FaFolderOpen />
      </button>

      {/* Botón Configuración */}
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded 
          ${selectedPanel === 'settings' ? 'bg-gray-700' : ''}
        `}
        onClick={() => togglePanel('settings')}
      >
        <FaUserFriends />
      </button>
    </div>
  );
};

export default LeftBar;
