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
import { IParticipantSingleCardProps } from '../../Interfaces/Participants';

const ParticipantTemplateSingleCard: React.FC<IParticipantSingleCardProps> = ({
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
    if (showModal && participants.personalDataId) {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      axios
        .get(
          `${apiUrl}/personalDataTemplate/${participants.personalDataId}`,
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
  }, [showModal, participants.personalDataId, accessToken, apiUrl]);

  const formattedCode = participants.code || '—';

  return (
    <>
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <div key={participants.id} className="my-2 space-y-4">
          {/* Campo: Código */}
          <div className="flex items-center gap-x-3">
            <HiOutlineIdentification className="text-sky-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              <strong>Código:</strong> {formattedCode}
            </h4>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end items-center gap-x-4 mt-4">
          {/* Mostrar Detalles */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 hover:bg-emerald-500 transition duration-200"
            aria-label="Mostrar detalles"
          >
            <HiOutlineEye className="text-white text-2xl" />
          </button>

          {/*Editar */}
          <button
            onClick={handleEditClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900 hover:bg-blue-800 transition duration-200"
            aria-label="Editar participante"
          >
            <HiOutlinePencil className="text-white text-2xl" />
          </button>

          {/* Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="w-8 h-8  flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 transition duration-200"
            aria-label="Eliminar participante"
          >
            <HiOutlineTrash className="text-white text-2xl" />
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
        id={participants.id}
        onEdited={handleParticipantEdited}
      />

      {/* Modal de eliminación */}
      <DeleteParticipantTemplateModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        id={participants.id}
        onDeleted={handleParticipantDeleted}
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
