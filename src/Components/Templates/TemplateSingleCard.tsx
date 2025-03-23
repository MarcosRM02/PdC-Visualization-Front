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

interface TemplateSingleCardProps {
  template: any;
  onTrialEdited: () => void;
  onTrialDeleted: () => void;
}

const TemplateSingleCard: React.FC<TemplateSingleCardProps> = ({
  template,
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
      {/* Enlace que permite abrir en nueva pestaña */}
      <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
        <Link to={detailsUrl} rel="noopener noreferrer">
          <div key={template.id} className="my-2 space-y-4">
            {/* Código */}
            <div className="flex items-center gap-x-3">
              <HiOutlineQrcode className="text-emerald-600 text-2xl" />
              <h4 className="text-slate-800 font-medium">
                Nombre: {template.name || '—'}
              </h4>
            </div>

            {/* Descripción */}
            <div className="flex items-center gap-x-3">
              <HiOutlineInformationCircle className="text-slate-600 text-2xl" />
              <h4 className="text-slate-800 font-medium">
                Descripción: {template.description || '—'}
              </h4>
            </div>
          </div>
          {/* Number of Participants */}
          <div className="flex items-center gap-x-3">
            <HiOutlineUserGroup className="text-sky-600 text-2xl" />
            <h4 className="text-slate-800 font-semibold">
              Número de Templates: {template.numberOfTemplates}
            </h4>
          </div>
        </Link>

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
      <EditTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        templateId={template.id}
        onTrialEdited={handleTrialEdited}
      />

      {/* Delete Trial Modal */}
      <DeleteTemplate
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onTrialDeleted={handleTrialDeleted}
        templateId={template.id}
      />
    </>
  );
};

export default React.memo(TemplateSingleCard);
