import React, { useState } from 'react';
import {
  HiOutlineQrcode,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineInformationCircle,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import EditTemplateModal from '../../Services/Update/EditTemplate';
import DeleteTemplate from '../../Services/Delete/DeleteTemplate';
import { Link } from 'react-router-dom';
import { ITrialTemplateSingleCardProps } from '../../Interfaces/Trials';

const TemplateSingleCard: React.FC<ITrialTemplateSingleCardProps> = ({
  trials: template,
  onTrialEdited,
  onTrialDeleted,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

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

  const detailsUrl = `/trialTemplates/by-professional/${template.id}`;

  return (
    <>
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <Link to={detailsUrl} rel="noopener noreferrer">
          <div key={template.id} className="my-2 space-y-4">
            {/* Nombre */}
            <div className="flex items-center gap-x-3">
              <HiOutlineQrcode className="text-sky-700 text-2xl" />

              <h4 className="text-gray-800 font-semibold text-lg">
                <strong>Name:</strong> {template.name || '—'}
              </h4>
            </div>

            {/* Descripción */}
            <div className="flex items-center gap-x-3">
              <HiOutlineInformationCircle className="text-sky-700 text-2xl" />

              <h4 className="text-gray-800 font-medium">
                <strong>Description:</strong> {template.description || '—'}
              </h4>
            </div>
          </div>
          {/* Número de Templates */}
          <div className="flex items-center gap-x-3">
            <HiOutlineUserGroup className="text-sky-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              <strong>Number of Trials:</strong> {template.numberOfTemplates}
            </h4>
          </div>
        </Link>

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

      {/* Modal de edición */}
      <EditTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        id={template.id}
        onEdited={handleTrialEdited}
      />

      {/* Modal de eliminación */}
      <DeleteTemplate
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleTrialDeleted}
        id={template.id}
      />
    </>
  );
};

export default React.memo(TemplateSingleCard);
