import React, { useState, useEffect } from 'react';
import {
  HiOutlineQrcode,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineAnnotation,
} from 'react-icons/hi';
import { getIDFromAPI } from '../../Services/Read/CreateWearablesURL';
import EditTrialModal from '../../Services/Update/EditTrial';
import DeleteTrialModal from '../../Services/Delete/DeleteTrial';
import { Link } from 'react-router-dom';

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
  const [data, setData] = useState({
    experimentId: null,
    wearablesIds: [],
  });
  const [error, setError] = useState('');
  const participantId = trials.participant.id;
  const swId = trials.sw.id;

  const [loading, _] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getIDFromAPI(participantId, swId);
        setData({
          experimentId: result.experimentId,
          wearablesIds: result.wearablesIds,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, [participantId, swId, refresh]);

  // Construcción de la URL para el Link
  const detailsBasePath = `/swData/getData/${data.experimentId}/${participantId}/${swId}/${trials.id}`;
  const wearableQuery = data.wearablesIds
    .map((id) => `wearableIds=${id}`)
    .join('&');
  const detailsUrl = `${detailsBasePath}?${wearableQuery}`;

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
        <Link to={detailsUrl} rel="noopener noreferrer">
          <div key={trials.id} className="my-2 space-y-4">
            {/* Fecha */}
            <div className="flex items-center gap-x-3">
              <HiOutlineCalendar className="text-emerald-600 text-2xl" />
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
              <HiOutlineClipboardList className="text-slate-600 text-2xl" />
              <h4 className="text-slate-800 font-medium">
                Descripción: {trials.description || '—'}
              </h4>
            </div>

            {/* Anotación */}
            <div className="flex items-center gap-x-3">
              <HiOutlineAnnotation className="text-slate-600 text-2xl" />
              <h4 className="text-slate-800 font-medium">
                Anotación: {trials.annotation || '—'}
              </h4>
            </div>
          </div>
        </Link>
        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-x-4 mt-2">
          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition-colors duration-200 group"
            aria-label="Editar prueba"
          >
            <HiOutlinePencil className="text-lg group-hover:scale-110 transition-transform" />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            className="bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition-colors duration-200 group"
            aria-label="Eliminar prueba"
          >
            <HiOutlineTrash className="text-lg group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 rounded-lg">
          <div className="text-white text-lg">Cargando...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-rose-800 bg-opacity-50 rounded-lg">
          <div className="text-white text-lg">{error}</div>
        </div>
      )}

      {/* Edit Trial Modal */}
      <EditTrialModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        trialId={trials.id}
        onTrialEdited={handleTrialEdited}
      />

      {/* Delete Trial Modal */}
      <DeleteTrialModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onTrialDeleted={handleTrialDeleted}
        trialId={trials.id}
      />
    </>
  );
};

export default React.memo(TrialSingleCard);
