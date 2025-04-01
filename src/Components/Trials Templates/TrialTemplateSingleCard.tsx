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
import { useParams } from 'react-router-dom';

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

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const tempolateId = useParams<{ id: string }>();

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
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <div className="my-2 space-y-4">
          {/* Fecha */}
          <div className="flex items-center gap-x-3">
            <FaRegCalendarCheck className="text-sky-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              <strong>Fecha:</strong> {formattedDate || '—'}
            </h4>
          </div>

          {/* Código */}
          <div className="flex items-center gap-x-3">
            <HiOutlineQrcode className="text-sky-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              <strong>Código:</strong> {trials.code || '—'}
            </h4>
          </div>

          {/* Descripción */}
          <div className="flex items-center gap-x-3">
            <HiOutlineInformationCircle className="text-sky-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              <strong>Descripción:</strong> {trials.description || '—'}
            </h4>
          </div>

          {/* Anotación */}
          <div className="flex items-center gap-x-3">
            <HiOutlineAnnotation className="text-sky-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              <strong>Notas:</strong> {trials.annotation || '—'}
            </h4>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end items-center gap-x-4 mt-2">
          {/* Botón Editar */}
          <button
            onClick={handleEditClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900 hover:bg-blue-800 transition duration-200"
            aria-label="Editar plantilla"
          >
            <HiOutlinePencil className="text-white text-2xl" />
          </button>

          {/* Botón Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 transition duration-200"
            aria-label="Eliminar plantilla"
          >
            <HiOutlineTrash className="text-white text-2xl" />
          </button>
        </div>
      </div>

      {/* Modal de Edición */}
      <EditTrialTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        trialTemplateId={trials.id}
        onTrialEdited={handleTrialEdited}
      />

      {/* Modal de Eliminación */}
      <DeleteTrialTemplate
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onTrialDeleted={handleTrialDeleted}
        templateId={Number(tempolateId.id)}
        trialId={trials.id}
      />
    </>
  );
};

export default React.memo(TrialSingleCard);
