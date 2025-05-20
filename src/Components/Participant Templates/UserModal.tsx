import React, { useState, useEffect } from 'react';
import {
  HiOutlineXCircle,
  HiOutlinePencil,
  HiOutlineCake,
  HiOutlineUser,
} from 'react-icons/hi';
import { GiFootprint, GiWeightScale } from 'react-icons/gi';
import { FaRulerVertical } from 'react-icons/fa';
import EditPersonalDataTemplateModal from '../../Services/Update/EditPersonalDataTemplate';
import { IUserModalProps } from '../../Interfaces/Participants';

const UserModal: React.FC<IUserModalProps> = ({ user, onClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const openEditModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handlePersonalDataEdited = (updatedUser: any) => {
    setCurrentUser(updatedUser);
  };

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-gray-700">No personal data Available</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-lg px-6 py-5 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
        >
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 focus:outline-none group"
          >
            <HiOutlineXCircle className="text-2xl text-rose-600 cursor-pointer group-hover:text-rose-700 transition-colors" />
          </button>

          {/* Título del modal */}
          <h2
            id="modal-title"
            className="text-2xl font-semibold mb-4 text-gray-800"
          >
            Participant's Personal Data
          </h2>

          {/* Contenido del modal */}
          <div className="space-y-4">
            {/* Nombre */}
            <div className="flex items-center gap-x-3">
              <HiOutlineUser className="text-sky-700 text-2xl" />
              <div>
                <span className="text-gray-700 font-medium">Name:</span>
                <span className="ml-2 text-gray-800 font-semibold text-xl">
                  {currentUser.name || '—'}
                </span>
              </div>
            </div>

            {/* Edad */}
            <div className="flex items-center gap-x-3">
              <HiOutlineCake className="text-sky-700 text-2xl" />
              <div>
                <span className="text-gray-700 font-medium">Age:</span>
                <span className="ml-2 text-gray-800 font-medium">
                  {currentUser.age || '—'} years
                </span>
              </div>
            </div>

            {/* Altura */}
            <div className="flex items-center gap-x-3">
              <FaRulerVertical className="text-sky-700 text-2xl" />

              <div>
                <span className="text-gray-700 font-medium">Height:</span>
                <span className="ml-2 text-gray-800 font-medium">
                  {currentUser.height ? `${currentUser.height} m` : '—'}
                </span>
              </div>
            </div>

            {/* Peso */}
            <div className="flex items-center gap-x-3">
              <GiWeightScale className="text-sky-700 text-2xl" />

              <div>
                <span className="text-gray-700 font-medium">Weight:</span>
                <span className="ml-2 text-gray-800 font-medium">
                  {currentUser.weight || '—'} kg
                </span>
              </div>
            </div>

            {/* Longitud de Pie */}
            <div className="flex items-center gap-x-3">
              <GiFootprint className="text-sky-700 text-2xl" />

              <div>
                <span className="text-gray-700 font-medium">Foot Length:</span>
                <span className="ml-2 text-gray-800 font-medium">
                  {currentUser.footLength || '—'} cm
                </span>
              </div>
            </div>
          </div>

          {/* Botón de edición */}
          <div className="flex justify-end items-center gap-x-4 mt-6">
            <button
              onClick={openEditModal}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900 hover:bg-blue-800 transition duration-200 group"
              aria-label="Editar datos personales"
            >
              <HiOutlinePencil className="text-white text-2xl group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de edición de datos personales */}
      <EditPersonalDataTemplateModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        id={currentUser.id}
        onEdited={handlePersonalDataEdited}
      />
    </>
  );
};

export default UserModal;
