import React, { useState, useEffect, useMemo } from 'react';
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
import Spinner from '../../Components/CommonComponents/Spinner';
import { ITrialSingleCardProps } from '../../Interfaces/Trials';

const TrialSingleCard: React.FC<ITrialSingleCardProps> = ({
  trials,
  onTrialEdited,
  onTrialDeleted,
  experimentId,
}) => {
  const [wearablesIds, setWearablesIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const participantId = trials.participant.id;
  const swId = trials.sw.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ids = await getIDFromAPI(swId);
        setWearablesIds(ids);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch wearables IDs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [swId, refresh]);

  // Memorizar la URL para que se regenere solo cuando cambien deps
  const detailsUrl = useMemo(() => {
    const base = `/swData/getData/${experimentId}/${participantId}/${swId}/${trials.id}`;
    if (wearablesIds.length === 0) return base;
    const query = wearablesIds.map((id) => `wearableIds=${id}`).join('&');
    return `${base}?${query}`;
  }, [experimentId, participantId, swId, trials.id, wearablesIds]);

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

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleTrialEdited = () => {
    onTrialEdited();
    setIsEditModalOpen(false);
    setRefresh((prev) => !prev);
  };

  const handleTrialDeleted = () => {
    onTrialDeleted();
    setRefresh((prev) => !prev);
  };

  return (
    <>
      {/* Spinner mientras cargan los wearables o falla */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner />
        </div>
      ) : (
        <div className="border border-slate-200 bg-white rounded-lg px-6 py-5 m-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
          <Link to={detailsUrl} rel="noopener noreferrer">
            <div className="my-2 space-y-4">
              {/* Fecha */}
              <div className="flex items-center gap-x-3">
                <FaRegCalendarCheck className="text-sky-700 text-2xl" />
                <h4 className="text-gray-800 font-medium">
                  <strong>Date:</strong> {formattedDate || '—'}
                </h4>
              </div>

              {/* Código */}
              <div className="flex items-center gap-x-3">
                <HiOutlineQrcode className="text-sky-700 text-2xl" />
                <h4 className="text-gray-800 font-medium">
                  <strong>Code:</strong> {trials.code || '—'}
                </h4>
              </div>

              {/* Descripción */}
              <div className="flex items-center gap-x-3">
                <HiOutlineInformationCircle className="text-sky-700 text-2xl" />
                <h4 className="text-gray-800 font-medium">
                  <strong>Description:</strong> {trials.description || '—'}
                </h4>
              </div>

              {/* Anotación */}
              <div className="flex items-center gap-x-3">
                <HiOutlineAnnotation className="text-sky-700 text-2xl" />
                <h4 className="text-gray-800 font-medium">
                  <strong>Notes:</strong> {trials.annotation || '—'}
                </h4>
              </div>
            </div>
          </Link>

          {/* Botones de acción */}
          <div className="flex justify-end items-center gap-x-4 mt-2">
            <button
              onClick={handleEditClick}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-900 hover:bg-blue-800 transition duration-200"
              aria-label="Editar trial"
            >
              <HiOutlinePencil className="text-white text-2xl" />
            </button>

            <button
              onClick={handleDeleteClick}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 transition duration-200"
              aria-label="Eliminar trial"
            >
              <HiOutlineTrash className="text-white text-2xl" />
            </button>
          </div>

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-rose-800 bg-opacity-50 rounded-lg">
              <div className="text-white text-lg">{error}</div>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <EditTrialModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        id={trials.id}
        onEdited={handleTrialEdited}
      />

      <DeleteTrialModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleTrialDeleted}
        id={trials.id}
      />
    </>
  );
};

export default React.memo(TrialSingleCard);
