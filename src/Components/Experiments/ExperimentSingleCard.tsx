// src/Components/Experiments/ExperimentSingleCard.tsx

import React, { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import {
  FaIdCard,
  FaUser,
  FaInfoCircle,
  FaCalendarCheck,
  FaCalendarTimes,
  FaStickyNote,
  FaUsers,
} from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DeleteExperimentModal from '../../Services/Delete/DeleteExperiment'; // Asegúrate de que la ruta es correcta
import EditExperimentModal from '../../Services/Update/EditExperiment'; // Importa el modal de edición

// Definir una interfaz para los props
interface Experiment {
  id: number;
  name: string;
  description: string;
  startDate: string;
  finishDate?: string; // Optional Attribute
  notes?: string; // Optional Attribute
  numberOfParticipants: number;
}

interface ExperimentSingleCardProps {
  experiments: Experiment;
  onExperimentDeleted: () => void; // Callback requerido para notificar al padre
  onExperimentEdited: () => void; // Nuevo Callback para editar
}

const ExperimentSingleCard: React.FC<ExperimentSingleCardProps> = ({
  experiments,
  onExperimentDeleted,
  onExperimentEdited,
}) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Función para formatear la fecha
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setEditModalOpen(true);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleExperimentDeleted = () => {
    console.log(
      `Experiment with ID: ${experiments.id} deleted. Notifying parent.`,
    );
    setDeleteModalOpen(false);
    onExperimentDeleted(); // Llamar al callback del padre
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleExperimentEdited = () => {
    console.log(
      `Experiment with ID: ${experiments.id} edited. Notifying parent.`,
    );
    setEditModalOpen(false);
    onExperimentEdited(); // Llamar al callback del padre
  };

  const formattedStartDate = formatDate(experiments.startDate);
  const formattedFinishDate = formatDate(experiments.finishDate || '');

  return (
    <>
      <div
        onClick={() =>
          navigate(`/participants/by-experiment/${experiments.id}`)
        }
        className="border-2 border-gray-500 rounded-lg px-6 py-4 m-4 relative hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer bg-white"
      >
        <div className="my-2 space-y-4">
          {/* ID */}
          <div className="flex items-center gap-x-3">
            <FaIdCard className="text-red-400 text-xl" />
            <h4 className="text-gray-700 font-medium">ID: {experiments.id}</h4>
          </div>

          {/* Nombre */}
          <div className="flex items-center gap-x-3">
            <FaUser className="text-blue-400 text-xl" />
            <h4 className="text-gray-700 font-medium">
              Nombre: {experiments.name}
            </h4>
          </div>

          {/* Descripción */}
          <div className="flex items-center gap-x-3">
            <FaInfoCircle className="text-green-400 text-xl" />
            <h4 className="text-gray-700 font-medium">
              Descripción: {experiments.description || '—'}
            </h4>
          </div>

          {/* Fecha de Inicio */}
          <div className="flex items-center gap-x-3">
            <FaCalendarCheck className="text-purple-400 text-xl" />
            <h4 className="text-gray-700 font-medium">
              Fecha de Inicio: {formattedStartDate || '—'}
            </h4>
          </div>

          {/* Fecha de Finalización */}
          <div className="flex items-center gap-x-3">
            <FaCalendarTimes className="text-orange-400 text-xl" />
            <h4 className="text-gray-700 font-medium">
              Fecha de Finalización: {formattedFinishDate || '—'}
            </h4>
          </div>

          {/* Notas */}
          <div className="flex items-center gap-x-3">
            <FaStickyNote className="text-teal-400 text-xl" />
            <h4 className="text-gray-700 font-medium">
              Notas: {experiments.notes || '—'}
            </h4>
          </div>

          {/* Número de Participantes */}
          <div className="flex items-center gap-x-3">
            <FaUsers className="text-indigo-400 text-xl" />
            <h4 className="text-gray-700 font-medium">
              Número de Participantes: {experiments.numberOfParticipants}
            </h4>
          </div>
        </div>

        {/* Botones de Editar y Eliminar */}
        <div className="flex justify-end items-center gap-x-4 mt-6">
          {/* Botón de Editar */}
          <button
            onClick={handleEditClick}
            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-200"
            aria-label="Editar experimento"
          >
            <AiOutlineEdit className="text-lg" />
          </button>

          {/* Botón de Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
            aria-label="Eliminar experimento"
          >
            <MdOutlineDelete className="text-lg" />
          </button>
        </div>
      </div>

      {/* Modal para Eliminar Experimento */}
      <DeleteExperimentModal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onExperimentDeleted={handleExperimentDeleted}
        experimentId={experiments.id}
      />

      {/* Modal para Editar Experimento */}
      <EditExperimentModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        experimentId={experiments.id}
        onExperimentEdited={handleExperimentEdited}
      />
    </>
  );
};

export default React.memo(ExperimentSingleCard);
