import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserFriends } from 'react-icons/fa';
import { RiGitRepositoryFill } from 'react-icons/ri';
import { MdOutlineCookie } from 'react-icons/md';
import { ILeftBarProps } from '../../../Interfaces/SideBar';

const LeftBar: React.FC<ILeftBarProps> = ({ selectedPanel, togglePanel }) => {
  const navigate = useNavigate();
  const professionalId = localStorage.getItem('professionalId');

  return (
    <div className="bg-gray-800 text-white w-16 flex flex-col items-center py-4">
      {/* Home */}
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded ${
          selectedPanel === 'home' ? 'bg-gray-700' : ''
        }`}
        onClick={() => {
          togglePanel('home');
          navigate(`/experiments/by-professional/${professionalId}`);
        }}
      >
        <FaHome />
      </button>

      {/* Participants */}
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded ${
          selectedPanel === 'settings' ? 'bg-gray-700' : ''
        }`}
        onClick={() => {
          togglePanel('allParticipants');
          navigate(`/participantTemplates/by-professional/${professionalId}`);
        }}
      >
        <FaUserFriends />
      </button>

      {/* Templates */}
      <button
        className={`my-2 p-2 hover:bg-gray-700 rounded ${
          selectedPanel === 'templates' ? 'bg-gray-700' : ''
        }`}
        onClick={() => {
          togglePanel('templates');
          navigate(`/templates/by-professional/${professionalId}`);
        }}
      >
        <RiGitRepositoryFill />
      </button>

      {/* Cookie Policy */}
      <button
        className="mt-auto mb-2 p-2 hover:bg-gray-700 rounded"
        onClick={() => window.open('/cookie-policy', '_blank')}
      >
        <MdOutlineCookie />
      </button>
    </div>
  );
};

export default LeftBar;
