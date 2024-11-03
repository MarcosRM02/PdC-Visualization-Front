import { AiOutlineEdit } from 'react-icons/ai';
import { FaIdCard, FaBarcode } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { BiShow } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import UserModal from './UserModal';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ParticipantSingleCard = ({ participants }: { participants: any }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleEditClick = (event: any) => {
    event.stopPropagation();
    navigate(`/participants/edit/${participants.id}`);
  };

  const handleDeleteClick = (event: any) => {
    event.stopPropagation();
    navigate(`/participants/delete/${participants.id}`);
  };

  useEffect(() => {
    if (showModal && participants.personalData?.id) {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      axios
        .get(`${apiUrl}/personalData/${participants.personalData.id}`, config)
        .then((response) => {
          setModalData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch data:', err);
          setError('Failed to load data');
          setLoading(false);
        });
    }
  }, [showModal, participants.personalData?.id, accessToken, apiUrl]);

  return (
    <div
      onClick={() => navigate(`/trials/by-participant/${participants.id}`)}
      className="border-2 border-gray-500 rounded-lg px-6 py-4 m-4 relative hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer bg-white"
    >
      <div key={participants.id} className="my-2 space-y-4">
        {/* ID */}
        <div className="flex items-center gap-x-3">
          <FaIdCard className="text-red-400 text-xl" />
          <h4 className="text-gray-700 font-medium">ID: {participants.id}</h4>
        </div>

        {/* Código */}
        <div className="flex items-center gap-x-3">
          <FaBarcode className="text-green-400 text-xl" />
          <h4 className="text-gray-700 font-medium">
            Code: {participants.code}
          </h4>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end items-center gap-x-4 mt-6">
        {/* Botón para Mostrar Detalles */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
          aria-label="Mostrar detalles"
        >
          <BiShow className="text-lg" />
        </button>

        {/* Botón de Editar */}
        <button
          onClick={handleEditClick}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-200"
          aria-label="Editar participante"
        >
          <AiOutlineEdit className="text-lg" />
        </button>

        {/* Botón de Eliminar */}
        <button
          onClick={handleDeleteClick}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
          aria-label="Eliminar participante"
        >
          <MdOutlineDelete className="text-lg" />
        </button>
      </div>

      {/* Modal para Mostrar Detalles */}
      {showModal && (
        <UserModal user={modalData} onClose={() => setShowModal(false)} />
      )}

      {/* Mostrar Estado de Carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
          <div className="text-white text-lg">Cargando...</div>
        </div>
      )}

      {/* Mostrar Errores */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-800 bg-opacity-50 rounded-lg">
          <div className="text-white text-lg">{error}</div>
        </div>
      )}
    </div>
  );
};

export default ParticipantSingleCard;
