import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import axios from 'axios';

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Para detectar clics fuera del menú y cerrarlo
  const menuRef = useRef<HTMLDivElement>(null);

  // Estado para controlar si la imagen da error
  const [hasImageError, setHasImageError] = useState(false);

  // Lógica de logout
  const handleLogout = async () => {
    try {
      // 1) Llamas al backend para borrar la cookie
      await axios.post('authentication/logout');
    } catch (err) {
      console.error('Error during logout:', err);
      // aunque falle, seguimos adelante
    } finally {
      // 2) Rediriges al login
      navigate('/', { replace: true });
    }
  };
  // Al hacer click en cualquier parte fuera del dropdown, se cierra
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ejemplo de función para “Editar usuario”, TODO: implementar
  const handleEditUser = () => {
    navigate('/usuario/editar');
  };

  return (
    <div className="relative bg-grey-800" ref={menuRef}>
      {/* Botón de usuario (icono/avatar) */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-700"
      >
        {/* Si la imagen no falla, se muestra <img>, de lo contrario un <div> con alt */}
        {!hasImageError ? (
          <img
            src="https://via.placeholder.com/32" // tu URL de avatar
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div
            className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm text-black"
            title="User Avatar"
          >
            {/* Texto alternativo dentro del círculo */}
            UA
          </div>
        )}
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
          <ul>
            <li>
              <button
                className="block w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 flex items-center space-x-2"
                onClick={handleEditUser}
              >
                <FaUserEdit className="text-lg text-white group-hover:scale-110 transition-transform" />
                <span className="text-white">Editar usuario</span>
              </button>
            </li>
            <li className="border-t border-gray-200"></li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 flex items-center space-x-2"
                onClick={handleLogout}
              >
                <MdLogout className="text-lg text-white  group-hover:scale-110 transition-transform" />
                <span className="text-white">Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
