// src/Components/Participants/UserModal.tsx

import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { FaBirthdayCake, FaRulerVertical, FaWeight } from 'react-icons/fa';
import { BiUserCircle } from 'react-icons/bi';
import { GiFootprint } from 'react-icons/gi'; // Nuevo icono
import { useNavigate } from 'react-router-dom';
import EditPersonalDataModal from '../../Services/Update/EditPersonalData'; // Ruta correcta

interface UserModalProps {
  user: any;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user); // Estado local para el usuario

  const navigate = useNavigate();

  // Función para abrir el modal de edición
  const openEditModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsEditModalOpen(true);
  };

  // Función para cerrar el modal de edición
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Función para manejar la actualización de datos personales
  const handlePersonalDataEdited = (updatedUser: any) => {
    setCurrentUser(updatedUser); // Actualiza el estado local con los datos editados
  };

  // Efecto para actualizar el estado local si el prop `user` cambia
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  if (!currentUser) {
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
              <span className="ml-2 text-gray-600">
                {currentUser.name || '—'}
              </span>
            </div>

            {/* Edad */}
            <div className="flex items-center">
              <FaBirthdayCake className="text-pink-500 text-xl mr-3" />
              <span className="text-gray-700 font-medium">Edad:</span>
              <span className="ml-2 text-gray-600">
                {currentUser.age || '—'} años
              </span>
            </div>

            {/* Altura */}
            <div className="flex items-center">
              <FaRulerVertical className="text-green-500 text-xl mr-3" />
              <span className="text-gray-700 font-medium">Altura:</span>
              <span className="ml-2 text-gray-600">
                {currentUser.height || '—'} m
              </span>
            </div>

            {/* Peso */}
            <div className="flex items-center">
              <FaWeight className="text-yellow-500 text-xl mr-3" />
              <span className="text-gray-700 font-medium">Peso:</span>
              <span className="ml-2 text-gray-600">
                {currentUser.weight || '—'} kg
              </span>
            </div>

            {/* Longitud de Pie */}
            <div className="flex items-center">
              <GiFootprint className="text-indigo-500 text-xl mr-3" />{' '}
              {/* Usando GiFoot */}
              <span className="text-gray-700 font-medium">
                Longitud de Pie:
              </span>
              <span className="ml-2 text-gray-600">
                {currentUser.footLength || '—'} cm
              </span>
            </div>
          </div>

          {/* Botón de Editar */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={openEditModal}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              aria-label="Editar datos personales"
            >
              <AiOutlineEdit className="mr-2" />
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Editar Datos Personales */}
      <EditPersonalDataModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        personalDataId={currentUser.id} // Asegúrate de que `currentUser.id` corresponde al ID de personalData
        onPersonalDataEdited={handlePersonalDataEdited}
      />
    </>
  );
};

export default UserModal;
