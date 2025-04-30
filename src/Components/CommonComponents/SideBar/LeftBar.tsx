import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserFriends } from 'react-icons/fa';
import { RiGitRepositoryFill } from 'react-icons/ri';
import { ILeftBarProps } from '../../../Interfaces/SideBar';

const LeftBar: React.FC<ILeftBarProps> = ({ selectedPanel, togglePanel }) => {
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
          navigate(`/experiments/by-professional/${professionalId}`);
        }}
      >
        <FaHome />
      </button>

      {/* Botón Configuración */}
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded 
          ${selectedPanel === 'settings' ? 'bg-gray-700' : ''}
        `}
        onClick={() => {
          togglePanel('allParticipants');
          navigate(`/participantTemplates/by-professional/${professionalId}`);
        }}
      >
        <FaUserFriends />
      </button>
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded 
          ${selectedPanel === 'templates' ? 'bg-gray-700' : ''}
        `}
        onClick={() => {
          togglePanel('templates');
          navigate(`/templates/by-professional/${professionalId}`);
        }}
      >
        <RiGitRepositoryFill />
      </button>
    </div>
  );
};

export default LeftBar;
