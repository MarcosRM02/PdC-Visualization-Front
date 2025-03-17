import React, { useEffect, useState } from 'react';
import LeftBar from './SideBar/LeftBar';
import SidePanel from './SideBar/SidePannel';
import { Outlet } from 'react-router-dom';
import UserMenu from './TopBar/UserMenu';

const Layout: React.FC = () => {
  // Tu estado, paneles, etc.
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

  const togglePanel = (panelId: string) => {
    setSelectedPanel((prev) => (prev === panelId ? null : panelId));
  };

  // Saber si el panel de "Proyectos" está abierto
  const isProjectsOpen = selectedPanel === 'proyectos';
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100); // Ajusta el delay según la duración de la animación del panel
  }, [isProjectsOpen]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Menú superior */}
      <header className="h-16 bg-gray-800 flex items-center justify-between px-4">
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>

      {/* Contenedor que ocupa el resto de la pantalla */}
      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral */}
        <LeftBar selectedPanel={selectedPanel} togglePanel={togglePanel} />
        <SidePanel isOpen={isProjectsOpen} />

        {/* Contenido principal */}
        <main className="flex-1 bg-white p-4 overflow-auto overflow-hidden ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
