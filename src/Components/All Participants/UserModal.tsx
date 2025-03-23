// src/Components/Participants/UserModal.tsx

import React, { useState, useEffect } from 'react';
import {
  HiOutlineXCircle,
  HiOutlinePencil,
  HiOutlineCake,
  HiOutlineUser,
} from 'react-icons/hi';
import { GiFootprint, GiWeightScale } from 'react-icons/gi'; // Importa GiFootprint
import EditPersonalDataModal from '../../Services/Update/EditPersonalData';
import { FaRulerVertical } from 'react-icons/fa';

interface UserModalProps {
  user: any;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
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
          <p className="text-slate-700">No personal data available.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
          >
            Cerrar
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
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 focus:outline-none group"
          >
            <HiOutlineXCircle className="text-2xl text-rose-500 cursor-pointer group-hover:text-rose-600 transition-colors" />
          </button>

          {/* Modal Title */}
          <h2
            id="modal-title"
            className="text-2xl font-semibold mb-4 text-slate-800"
          >
            Datos Personales del Participante
          </h2>

          {/* Modal Content */}
          <div className="space-y-4">
            {/* Nombre */}
            <div className="flex items-center gap-x-3">
              <HiOutlineUser className="text-emerald-600 text-2xl" />
              <div>
                <span className="text-slate-700 font-medium">Nombre:</span>
                <span className="ml-2 text-slate-800">
                  {currentUser.name || '—'}
                </span>
              </div>
            </div>

            {/* Edad */}
            <div className="flex items-center gap-x-3">
              <HiOutlineCake className="text-indigo-600 text-2xl" />
              <div>
                <span className="text-slate-700 font-medium">Edad:</span>
                <span className="ml-2 text-slate-800">
                  {currentUser.age || '—'} años
                </span>
              </div>
            </div>

            {/* Altura */}
            <div className="flex items-center gap-x-3">
              <FaRulerVertical className="text-teal-600 text-2xl" />{' '}
              {/* Icono actualizado */}
              <div>
                <span className="text-slate-700 font-medium">Altura:</span>
                <span className="ml-2 text-slate-800">
                  {currentUser.height ? `${currentUser.height} m` : '—'}
                </span>
              </div>
            </div>

            {/* Peso */}
            <div className="flex items-center gap-x-3">
              <GiWeightScale className="text-cyan-600 text-2xl" />
              <div>
                <span className="text-slate-700 font-medium">Peso:</span>
                <span className="ml-2 text-slate-800">
                  {currentUser.weight || '—'} kg
                </span>
              </div>
            </div>

            {/* Longitud de Pie */}
            <div className="flex items-center gap-x-3">
              <GiFootprint className="text-violet-600 text-2xl" />{' '}
              {/* Icono actualizado */}
              <div>
                <span className="text-slate-700 font-medium">
                  Longitud de Pie:
                </span>
                <span className="ml-2 text-slate-800">
                  {currentUser.footLength || '—'} cm
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end items-center gap-x-4 mt-6">
            <button
              onClick={openEditModal}
              className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition-colors duration-200 group"
              aria-label="Editar datos personales"
            >
              <HiOutlinePencil className="text-lg group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Personal Data Modal */}
      <EditPersonalDataModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        personalDataId={currentUser.id}
        onPersonalDataEdited={handlePersonalDataEdited}
      />
    </>
  );
};

export default UserModal;
