import React, { useState, useEffect } from 'react';
import {
  HiOutlineIdentification,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import UserModal from './UserModal';
import EditParticipantTemplateModal from '../../Services/Update/EditParticipantTemplate';
import DeleteParticipantTemplateModal from '../../Services/Delete/DeleteParticipantTemplate';
import axios from 'axios';

interface Participant {
  id: number;
  code: string;
  personaldataid: number;
}

interface ParticipantTemplateSingleCardProps {
  participants: Participant;
  onParticipantDeleted: () => void;
  onParticipantEdited: () => void;
}

const ParticipantTemplateSingleCard: React.FC<
  ParticipantTemplateSingleCardProps
> = ({ participants, onParticipantDeleted, onParticipantEdited }) => {
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
    if (showModal && participants.personaldataid) {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      axios
        .get(
          `${apiUrl}/personalDataTemplate/${participants.personaldataid}`,
          config,
        )
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
  }, [showModal, participants.personaldataid, accessToken, apiUrl]);

  const formattedCode = participants.code || '—';
  return (
    <>
      {/* Enlace que permite abrir en nueva pestaña */}
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <div key={participants.id} className="my-2 space-y-4">
          {/* Código */}
          <div className="flex items-center gap-x-3">
            <HiOutlineIdentification className="text-emerald-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Código: {formattedCode}
            </h4>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end items-center gap-x-4 mt-2">
          {/* Mostrar Detalles */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="text-teal-500 rounded-md duration-200 group"
            aria-label="Mostrar detalles"
          >
            <HiOutlineEye className="text-3xl group-hover:scale-150 transition-transform" />
          </button>

          {/* Editar */}
          <button
            onClick={handleEditClick}
            className="text-yellow-500 rounded-md  duration-200 group"
            aria-label="Editar experimento"
          >
            <HiOutlinePencil className="text-3xl group-hover:scale-150 transition-transform" />
          </button>

          {/* Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="text-rose-500  rounded-md duration-200 group"
            aria-label="Eliminar experimento"
          >
            <HiOutlineTrash className="text-3xl group-hover:scale-150 transition-transform" />
          </button>
        </div>

        {/* Modal de detalles */}
        {showModal && (
          <UserModal user={modalData} onClose={() => setShowModal(false)} />
        )}
      </div>
      {/* Modal de edición */}
      <EditParticipantTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        participantId={participants.id}
        onParticipantEdited={handleParticipantEdited}
      />

      {/* Modal de eliminación */}
      <DeleteParticipantTemplateModal
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

export default React.memo(ParticipantTemplateSingleCard);
