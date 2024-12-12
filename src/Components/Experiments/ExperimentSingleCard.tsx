import React, { useState } from 'react';
import {
  HiOutlineUser,
  HiOutlineInformationCircle,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import DeleteExperimentModal from '../../Services/Delete/DeleteExperiment';
import EditExperimentModal from '../../Services/Update/EditExperiment';

// Interface for Experiment
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

  // Date formatting function
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
        className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer"
      >
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-x-3">
            <HiOutlineUser className="text-emerald-600 text-2xl" />
            <h4 className="text-slate-800 font-semibold">
              Nombre: {experiment.name}
            </h4>
          </div>

          {/* Description */}
          <div className="flex items-center gap-x-3">
            <HiOutlineInformationCircle className="text-indigo-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Descripción: {experiment.description || '—'}
            </h4>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-x-3">
            <HiOutlineCalendar className="text-teal-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Fecha de Inicio: {formattedStartDate || '—'}
            </h4>
          </div>

          {/* Finish Date */}
          <div className="flex items-center gap-x-3">
            <HiOutlineCalendar className="text-cyan-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Fecha de Finalización: {formattedFinishDate || '—'}
            </h4>
          </div>

          {/* Notes */}
          <div className="flex items-center gap-x-3">
            <HiOutlineDocumentText className="text-violet-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Notas: {experiment.notes || '—'}
            </h4>
          </div>

          {/* Number of Participants */}
          <div className="flex items-center gap-x-3">
            <HiOutlineUserGroup className="text-sky-600 text-2xl" />
            <h4 className="text-slate-800 font-semibold">
              Número de Participantes: {experiment.numberOfParticipants}
            </h4>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-x-4 mt-6">
          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition-colors duration-200 group"
            aria-label="Editar experimento"
          >
            <HiOutlinePencil className="text-lg group-hover:scale-110 transition-transform" />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            className="bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition-colors duration-200 group"
            aria-label="Eliminar experimento"
          >
            <HiOutlineTrash className="text-lg group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Delete Experiment Modal */}
      <DeleteExperimentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onExperimentDeleted={handleExperimentDeleted}
        experimentId={experiment.id}
      />

      {/* Edit Experiment Modal */}
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
