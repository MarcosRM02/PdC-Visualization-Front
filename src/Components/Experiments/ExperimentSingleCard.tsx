// ExperimentSingleCard.tsx
import React, { useState } from 'react';
import {
  HiOutlineUser,
  HiOutlineInformationCircle,
  HiOutlineUserGroup,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineAnnotation,
} from 'react-icons/hi';
import { FaRegCalendarAlt, FaRegCalendarCheck } from 'react-icons/fa';
import DeleteExperimentModal from '../../Services/Delete/DeleteExperiment';
import EditExperimentModal from '../../Services/Update/EditExperiment';
import { Link } from 'react-router-dom';

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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

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
    console.log(`Experiment with ID: ${experiment.id} deleted.`);
    setDeleteModalOpen(false);
    onExperimentDeleted();
  };

  const handleExperimentEdited = () => {
    console.log(`Experiment with ID: ${experiment.id} edited.`);
    setEditModalOpen(false);
    onExperimentEdited();
  };

  const formattedStartDate = formatDate(experiment.startDate);
  const formattedFinishDate = formatDate(experiment.finishDate || '');

  const detailsUrl = `/participants/by-experiment/${experiment.id}`;

  return (
    <>
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <Link to={detailsUrl} rel="noopener noreferrer">
          <div className="space-y-4">
            {/* Nombre – destacado */}
            <div className="flex items-center gap-x-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-950">
                <HiOutlineUser className="text-white text-xl" />
              </div>
              <h4 className="text-gray-800 font-semibold text-2xl">
                {experiment.name}
              </h4>
            </div>

            {/* Descripción */}
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900">
                <HiOutlineInformationCircle className="text-white text-lg" />
              </div>
              <h4 className="text-gray-800 font-medium">
                <strong>Descripción:</strong> {experiment.description || '—'}
              </h4>
            </div>

            {/* Fecha de Inicio */}
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900">
                <FaRegCalendarAlt className="text-white text-lg" />
              </div>
              <h4 className="text-gray-800 font-medium">
                <strong>Fecha de Inicio:</strong> {formattedStartDate || '—'}
              </h4>
            </div>

            {/* Fecha de Finalización */}
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900">
                <FaRegCalendarCheck className="text-white text-lg" />
              </div>
              <h4 className="text-gray-800 font-medium">
                <strong>Fecha de Finalización:</strong>{' '}
                {formattedFinishDate || '—'}
              </h4>
            </div>

            {/* Notas */}
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900">
                <HiOutlineAnnotation className="text-white text-lg" />
              </div>
              <h4 className="text-gray-800 font-medium">
                <strong>Notas:</strong> {experiment.notes || '—'}
              </h4>
            </div>

            {/* Número de Participantes */}
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900">
                <HiOutlineUserGroup className="text-white text-lg" />
              </div>
              <h4 className="text-gray-800 font-semibold">
                <strong>Número de Participantes:</strong>{' '}
                {experiment.numberOfParticipants}
              </h4>
            </div>
          </div>
        </Link>

        {/* Botones de acción */}
        <div className="flex justify-end items-center gap-x-4 mt-2">
          {/* Botón Editar */}
          <button
            onClick={handleEditClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-900 hover:bg-blue-800 transition duration-200"
            aria-label="Editar experimento"
          >
            <HiOutlinePencil className="text-white text-2xl" />
          </button>

          {/* Botón Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 transition duration-200"
            aria-label="Eliminar experimento"
          >
            <HiOutlineTrash className="text-white text-2xl" />
          </button>
        </div>
      </div>

      <DeleteExperimentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onExperimentDeleted={handleExperimentDeleted}
        experimentId={experiment.id}
      />

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
