// src/Components/Participants/ParticipantSingleCard.tsx

import React, { useState, useEffect } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaIdCard, FaBarcode } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { BiShow } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import UserModal from './UserModal';
import EditParticipantModal from '../../Services/Update/EditParticipant'; // Importa el modal de edición
import DeleteParticipantModal from '../../Services/Delete/DeleteParticipant'; // Importa el modal de eliminación
import axios from 'axios';

interface Participant {
  id: number;
  code: string;
  personalData?: {
    id: number;
    // Otros campos relevantes
  };
  // Otros campos relevantes
}

interface ParticipantSingleCardProps {
  participants: Participant;
  onParticipantDeleted: () => void; // Callback para notificar al padre
  onParticipantEdited: () => void; // Callback para notificar al padre
}

const ParticipantSingleCard: React.FC<ParticipantSingleCardProps> = ({
  participants,
  onParticipantDeleted,
  onParticipantEdited,
}) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setEditModalOpen(true);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleParticipantEdited = () => {
    setEditModalOpen(false);
    onParticipantEdited(); // Notificar al padre para actualizar la lista
  };

  const handleParticipantDeleted = () => {
    setDeleteModalOpen(false);
    onParticipantDeleted(); // Notificar al padre para actualizar la lista
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

  const formattedCode = participants.code || '—';

  return (
    <>
      <div
        onClick={() => navigate(`/trials/by-participant/${participants.id}`)}
        className="border border-gray-300 bg-white rounded-lg px-6 py-4 m-4 relative hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
      >
        <div key={participants.id} className="my-2 space-y-4">
          {/* ID */}
          <div className="flex items-center gap-x-3">
            <FaIdCard className="text-blue-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">ID: {participants.id}</h4>
          </div>

          {/* Código */}
          <div className="flex items-center gap-x-3">
            <FaBarcode className="text-blue-500 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Código: {formattedCode}
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
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-200"
            aria-label="Mostrar detalles"
          >
            <BiShow className="text-lg" />
          </button>

          {/* Botón de Editar */}
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
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
      </div>

      {/* Modal para Mostrar Detalles */}
      {showModal && (
        <UserModal user={modalData} onClose={() => setShowModal(false)} />
      )}

      {/* Modal para Editar Participante */}
      <EditParticipantModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        participantId={participants.id}
        onParticipantEdited={handleParticipantEdited}
      />

      {/* Modal para Eliminar Participante */}
      <DeleteParticipantModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        participantId={participants.id}
        onParticipantDeleted={handleParticipantDeleted}
      />

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
    </>
  );
};

export default React.memo(ParticipantSingleCard);
