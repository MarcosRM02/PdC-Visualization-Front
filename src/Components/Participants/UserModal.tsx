import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { FaBirthdayCake, FaRulerVertical, FaWeight } from 'react-icons/fa';
import { BiUserCircle } from 'react-icons/bi';
import { GiFootprint } from 'react-icons/gi'; // Nuevo icono
import { useNavigate } from 'react-router-dom';

const UserModal = ({ user, onClose }: { user: any; onClose: any }) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-gray-700">No personal data available.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const handleEditClick = (event: any) => {
    event.stopPropagation();
    navigate(`/personalData/edit/${user.id}`);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-xl p-6 relative shadow-lg"
      >
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 focus:outline-none group"
        >
          <AiOutlineClose className="text-2xl text-red-600 cursor-pointer group-hover:text-gray-800 transition-colors" />
        </button>

        {/* Título del Modal */}
        <h2
          id="modal-title"
          className="text-2xl font-semibold mb-4 text-gray-700"
        >
          Datos Personales del Participante
        </h2>

        {/* Contenido del Modal */}
        <div className="space-y-4">
          {/* Nombre */}
          <div className="flex items-center">
            <BiUserCircle className="text-blue-500 text-xl mr-3" />
            <span className="text-gray-700 font-medium">Nombre:</span>
            <span className="ml-2 text-gray-600">{user.name || '—'}</span>
          </div>

          {/* Edad */}
          <div className="flex items-center">
            <FaBirthdayCake className="text-pink-500 text-xl mr-3" />
            <span className="text-gray-700 font-medium">Edad:</span>
            <span className="ml-2 text-gray-600">{user.age || '—'} años</span>
          </div>

          {/* Altura */}
          <div className="flex items-center">
            <FaRulerVertical className="text-green-500 text-xl mr-3" />
            <span className="text-gray-700 font-medium">Altura:</span>
            <span className="ml-2 text-gray-600">{user.height || '—'} m</span>
          </div>

          {/* Peso */}
          <div className="flex items-center">
            <FaWeight className="text-yellow-500 text-xl mr-3" />
            <span className="text-gray-700 font-medium">Peso:</span>
            <span className="ml-2 text-gray-600">{user.weight || '—'} kg</span>
          </div>

          {/* Longitud de Pie */}
          <div className="flex items-center">
            <GiFootprint className="text-indigo-500 text-xl mr-3" />{' '}
            {/* Usando GiFoot */}
            <span className="text-gray-700 font-medium">Longitud de Pie:</span>
            <span className="ml-2 text-gray-600">
              {user.footLength || '—'} cm
            </span>
          </div>
        </div>

        {/* Botón de Editar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleEditClick}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            aria-label="Editar datos personales"
          >
            <AiOutlineEdit className="mr-2" />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
