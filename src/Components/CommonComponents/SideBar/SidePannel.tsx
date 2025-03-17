import React from 'react';
import ProjectsTree from './NavigationTree';

interface SidePanelProps {
  isOpen: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen }) => {
  return (
    <div
      className={`
        bg-gray-100 border-r border-gray-300 
        transition-all duration-300 
        ${isOpen ? 'w-64' : 'w-0'}
        overflow-hidden
      `}
    >
      {/* Si está abierto, mostramos el contenido, de lo contrario nada */}
      {isOpen && (
        <div className="p-4 h-full">
          <h2 className="text-lg font-bold mb-4">Proyectos</h2>
          <ProjectsTree />
        </div>
      )}
    </div>
  );
};

export default SidePanel;
