import React, { useState, useEffect } from 'react';
import {
  HiOutlineQrcode,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import UserModal from './UserModal';
import EditParticipantModal from '../../Services/Update/EditParticipant';
import DeleteParticipantModal from '../../Services/Delete/DeleteParticipant';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Participant {
  id: number;
  code: string;
  personalData?: {
    id: number;
  };
}

interface ParticipantSingleCardProps {
  participants: Participant;
  onParticipantDeleted: () => void;
  onParticipantEdited: () => void;
}

const ParticipantSingleCard: React.FC<ParticipantSingleCardProps> = ({
  participants,
  onParticipantDeleted,
  onParticipantEdited,
}) => {
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
    onParticipantEdited();
  };

  const handleParticipantDeleted = () => {
    setDeleteModalOpen(false);
    onParticipantDeleted();
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

  const detailsUrl = `/trials/by-participant/${participants.id}`;

  return (
    <>
      {/* Enlace que permite abrir en nueva pestaña */}
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <Link to={detailsUrl} rel="noopener noreferrer">
          <div key={participants.id} className="my-2 space-y-4">
            {/* Código */}
            <div className="flex items-center gap-x-3">
              <HiOutlineQrcode className="text-emerald-600 text-2xl" />
              <h4 className="text-slate-800 font-medium">
                Código: {formattedCode}
              </h4>
            </div>
          </div>
        </Link>

        {/* Botones de acción */}
        <div className="flex justify-end items-center gap-x-4 mt-2">
          {/* Mostrar Detalles */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 transition-colors duration-200 group"
            aria-label="Mostrar detalles"
          >
            <HiOutlineEye className="text-lg group-hover:scale-110 transition-transform" />
          </button>

          {/* Editar */}
          <button
            onClick={handleEditClick}
            className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition-colors duration-200 group"
            aria-label="Editar participante"
          >
            <HiOutlinePencil className="text-lg group-hover:scale-110 transition-transform" />
          </button>

          {/* Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition-colors duration-200 group"
            aria-label="Eliminar participante"
          >
            <HiOutlineTrash className="text-lg group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Modal de detalles */}
        {showModal && (
          <UserModal user={modalData} onClose={() => setShowModal(false)} />
        )}
      </div>
      {/* Modal de edición */}
      <EditParticipantModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        participantId={participants.id}
        onParticipantEdited={handleParticipantEdited}
      />

      {/* Modal de eliminación */}
      <DeleteParticipantModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        participantId={participants.id}
        onParticipantDeleted={handleParticipantDeleted}
      />

      {/* Estado de carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 rounded-lg">
          <div className="text-white text-lg">Cargando...</div>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-rose-800 bg-opacity-50 rounded-lg">
          <div className="text-white text-lg">{error}</div>
        </div>
      )}
    </>
  );
};

export default React.memo(ParticipantSingleCard);
