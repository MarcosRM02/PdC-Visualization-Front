import { useState } from 'react';
import LeftBar from './SideBar/LeftBar';
import { Outlet } from 'react-router-dom';
import UserMenu from './TopBar/UserMenu';

const Layout: React.FC = () => {
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

  const togglePanel = (panelId: string) => {
    setSelectedPanel((prev) => (prev === panelId ? null : panelId));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Menú superior */}
      <header className="h-16 bg-gray-800 flex items-center justify-between px-4">
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral */}
        <LeftBar selectedPanel={selectedPanel} togglePanel={togglePanel} />

        {/* Contenido principal */}
        <main className="flex-1 bg-white p-4 overflow-auto overflow-hidden ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
