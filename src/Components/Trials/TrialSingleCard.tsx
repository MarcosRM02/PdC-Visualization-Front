import React, { useState, useEffect } from 'react';
import {
  HiOutlineQrcode,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineAnnotation,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import { FaRegCalendarCheck } from 'react-icons/fa';
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

  // Formateo de fecha
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
        <Link to={detailsUrl} rel="noopener noreferrer">
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
        </Link>

        {/* Botones de acción */}
        <div className="flex justify-end items-center gap-x-4 mt-2">
          {/* Botón Editar */}
          <button
            onClick={handleEditClick}
            className="w-8 h-8  flex items-center justify-center rounded-full bg-sky-900 hover:bg-blue-800 transition duration-200"
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
