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
import { IExperimentSingleCardProps } from '../../Interfaces/Experiments';

const ExperimentSingleCard: React.FC<IExperimentSingleCardProps> = ({
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
    setDeleteModalOpen(false);
    onExperimentDeleted();
  };

  const handleExperimentEdited = () => {
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
            {/* Nombre*/}
            <div className="flex items-center gap-x-3">
              <HiOutlineUser className="text-sky-700 text-2xl" />
              <h4 className="text-gray-800 font-semibold text-2xl">
                {experiment.name}
              </h4>
            </div>

            {/* Descripción */}
            <div className="flex items-center gap-x-3">
              <HiOutlineInformationCircle className="text-sky-700 text-2xl" />

              <h4 className="text-gray-800 font-medium">
                <strong>Description</strong> {experiment.description || '—'}
              </h4>
            </div>

            {/* Fecha de Inicio */}
            <div className="flex items-center gap-x-3">
              <FaRegCalendarAlt className="text-sky-700 text-2xl" />

              <h4 className="text-gray-800 font-medium">
                <strong>Start Date:</strong> {formattedStartDate || '—'}
              </h4>
            </div>

            {/* Fecha de Finalización */}
            <div className="flex items-center gap-x-3">
              <FaRegCalendarCheck className="text-sky-700 text-2xl" />

              <h4 className="text-gray-800 font-medium">
                <strong>Completion Date:</strong> {formattedFinishDate || '—'}
              </h4>
            </div>

            {/* Notas */}
            <div className="flex items-center gap-x-3">
              <HiOutlineAnnotation className="text-sky-700 text-2xl" />

              <h4 className="text-gray-800 font-medium">
                <strong>Notes:</strong> {experiment.notes || '—'}
              </h4>
            </div>

            {/* Número de Participantes */}
            <div className="flex items-center gap-x-3">
              <HiOutlineUserGroup className="text-sky-700 text-2xl" />

              <h4 className="text-gray-800 font-semibold">
                <strong>Number of Participants:</strong>{' '}
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900 hover:bg-blue-800 transition duration-200"
            aria-label="Editar experimento"
          >
            <HiOutlinePencil className="text-white text-2xl" />
          </button>

          {/* Botón Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 transition duration-200"
            aria-label="Eliminar experimento"
          >
            <HiOutlineTrash className="text-white text-2xl" />
          </button>
        </div>
      </div>

      <DeleteExperimentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDeleted={handleExperimentDeleted}
        id={experiment.id}
      />

      <EditExperimentModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        id={experiment.id}
        onEdited={handleExperimentEdited}
      />
    </>
  );
};

export default React.memo(ExperimentSingleCard);
