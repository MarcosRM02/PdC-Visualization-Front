import React, { useState } from 'react';
import {
  HiOutlineQrcode,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineAnnotation,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import { FaRegCalendarCheck } from 'react-icons/fa';
import EditTrialTemplateModal from '../../Services/Update/EditTrialTemplate';
import DeleteTrialTemplate from '../../Services/Delete/DeleteTrialTemplate';

interface TrialSingleCardProps {
  trials: any;
  onTrialEdited: () => void;
  onTrialDeleted: () => void;
}

const TrialSingleCard: React.FC<TrialSingleCardProps> = ({
  trials,
  onTrialEdited,
  onTrialDeleted,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Función para formatear la fecha y validar su validez
  const formatDate = (dateString: string) => {
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

  const formattedDate = formatDate(trials.date);

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleTrialEdited = () => {
    onTrialEdited();
    setIsEditModalOpen(false);
    setRefresh(!refresh);
  };

  const handleTrialDeleted = () => {
    onTrialDeleted();
    setRefresh(!refresh);
  };

  return (
    <>
      {/* Enlace que permite abrir en nueva pestaña */}
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <div key={trials.id} className="my-2 space-y-4">
          {/* Fecha */}
          <div className="flex items-center gap-x-3">
            <FaRegCalendarCheck className="text-emerald-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Fecha: {formattedDate || '—'}
            </h4>
          </div>

          {/* Código */}
          <div className="flex items-center gap-x-3">
            <HiOutlineQrcode className="text-emerald-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Código: {trials.code || '—'}
            </h4>
          </div>

          {/* Descripción */}
          <div className="flex items-center gap-x-3">
            <HiOutlineInformationCircle className="text-slate-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Descripción: {trials.description || '—'}
            </h4>
          </div>

          {/* Anotación */}
          <div className="flex items-center gap-x-3">
            <HiOutlineAnnotation className="text-slate-600 text-2xl" />
            <h4 className="text-slate-800 font-medium">
              Notas: {trials.annotation || '—'}
            </h4>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-x-4 mt-2">
          <button
            onClick={handleEditClick}
            className="text-yellow-500   rounded-md duration-200 group"
            aria-label="Editar experimento"
          >
            <HiOutlinePencil className="text-3xl  group-hover:scale-150 transition-transform" />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            className="text-rose-500  rounded-md duration-200 group"
            aria-label="Eliminar experimento"
          >
            <HiOutlineTrash className="text-3xl group-hover:scale-150 transition-transform" />
          </button>
        </div>
      </div>

      {/* Edit Trial Modal */}
      <EditTrialTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        trialTemplateId={trials.id}
        onTrialEdited={handleTrialEdited}
      />

      {/* Delete Trial Modal */}
      <DeleteTrialTemplate
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onTrialDeleted={handleTrialDeleted}
        trialId={trials.id}
      />
    </>
  );
};

export default React.memo(TrialSingleCard);
