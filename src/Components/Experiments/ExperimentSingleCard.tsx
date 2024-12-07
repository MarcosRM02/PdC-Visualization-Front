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
import DeleteExperimentModal from '../../Services/Delete/DeleteExperiment';
import EditExperimentModal from '../../Services/Update/EditExperiment';

// Definir una interfaz para los props
interface Experiment {
  id: number;
  name: string;
  description: string;
  startDate: string;
  finishDate?: string;
  notes?: string;
  numberOfParticipants: number;
}

interface ExperimentSingleCardProps {
  experiment: Experiment;
  onExperimentDeleted: () => void;
  onExperimentEdited: () => void;
}

const ExperimentSingleCard: React.FC<ExperimentSingleCardProps> = ({
  experiment,
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

  const handleExperimentDeleted = () => {
    console.log(
      `Experiment with ID: ${experiment.id} deleted. Notifying parent.`,
    );
    setDeleteModalOpen(false);
    onExperimentDeleted();
  };

  const handleExperimentEdited = () => {
    console.log(
      `Experiment with ID: ${experiment.id} edited. Notifying parent.`,
    );
    setEditModalOpen(false);
    onExperimentEdited();
  };

  const formattedStartDate = formatDate(experiment.startDate);
  const formattedFinishDate = formatDate(experiment.finishDate || '');

  return (
    <>
      <div
        onClick={() => navigate(`/participants/by-experiment/${experiment.id}`)}
        className="border border-gray-300 bg-white rounded-lg px-6 py-4 m-4 relative hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
      >
        <div className="space-y-4">
          {/* ID */}
          <div className="flex items-center gap-x-3">
            <FaIdCard className="text-blue-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">ID: {experiment.id}</h4>
          </div>

          {/* Nombre */}
          <div className="flex items-center gap-x-3">
            <FaUser className="text-blue-500 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Nombre: {experiment.name}
            </h4>
          </div>

          {/* Descripción */}
          <div className="flex items-center gap-x-3">
            <FaInfoCircle className="text-blue-500 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Descripción: {experiment.description || '—'}
            </h4>
          </div>

          {/* Fecha de Inicio */}
          <div className="flex items-center gap-x-3">
            <FaCalendarCheck className="text-blue-300 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Fecha de Inicio: {formattedStartDate || '—'}
            </h4>
          </div>

          {/* Fecha de Finalización */}
          <div className="flex items-center gap-x-3">
            <FaCalendarTimes className="text-blue-200 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Fecha de Finalización: {formattedFinishDate || '—'}
            </h4>
          </div>

          {/* Notas */}
          <div className="flex items-center gap-x-3">
            <FaStickyNote className="text-blue-200 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Notas: {experiment.notes || '—'}
            </h4>
          </div>

          {/* Número de Participantes */}
          <div className="flex items-center gap-x-3">
            <FaUsers className="text-blue-500 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Número de Participantes: {experiment.numberOfParticipants}
            </h4>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end items-center gap-x-4 mt-6">
          {/* Botón de Editar */}
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
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
        onClose={() => setDeleteModalOpen(false)}
        onExperimentDeleted={handleExperimentDeleted}
        experimentId={experiment.id}
      />

      {/* Modal para Editar Experimento */}
      <EditExperimentModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        experimentId={experiment.id}
        onExperimentEdited={handleExperimentEdited}
      />
    </>
  );
};

export default React.memo(ExperimentSingleCard);
