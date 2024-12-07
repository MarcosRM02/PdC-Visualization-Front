// src/Components/Trials/TrialSingleCard.tsx

import React, { useState, useEffect } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import {
  FaIdCard,
  FaCalendarAlt,
  FaBarcode,
  FaAlignLeft,
  FaStickyNote,
  FaMicrochip,
} from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getIDFromAPI } from '../../Services/Read/CreateWearablesURL';
import EditTrialModal from '../../Services/Update/EditTrial'; // Asegúrate de que la ruta es correcta
import DeleteTrialModal from '../../Services/Delete/DeleteTrial'; // Importar el modal de eliminar

interface TrialSingleCardProps {
  trials: any;
  onTrialEdited: () => void; // Callback para edición
  onTrialDeleted: () => void; // Nuevo callback para eliminación
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para el modal de eliminar
  const [refresh, setRefresh] = useState(false); // Para refrescar datos después de editar

  const navigate = useNavigate();

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
    // Verificar si la fecha es válida
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

  // Función para abrir el modal de edición
  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsEditModalOpen(true);
  };

  // Función para manejar la edición exitosa
  const handleTrialEdited = () => {
    onTrialEdited(); // Notificar al componente padre
    setIsEditModalOpen(false);
    setRefresh(!refresh); // Cambia el estado para refrescar los datos
  };

  // Función para abrir el modal de eliminar
  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  // Función para manejar la eliminación exitosa
  const handleTrialDeleted = () => {
    onTrialDeleted(); // Notificar al componente padre
    setRefresh(!refresh); // Refrescar los datos si es necesario
  };

  return (
    <>
      <div
        onClick={() => navigate(detailsUrl)}
        className="border border-gray-300 bg-white rounded-lg px-6 py-4 m-4 relative hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
      >
        <div key={trials.id} className="my-2 space-y-4">
          {/* ID */}
          <div className="flex items-center gap-x-3">
            <FaIdCard className="text-blue-700 text-2xl" />
            <h4 className="text-gray-800 font-medium">ID: {trials.id}</h4>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-x-3">
            <FaCalendarAlt className="text-blue-500 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Fecha: {formattedDate || '—'}
            </h4>
          </div>

          {/* Código */}
          <div className="flex items-center gap-x-3">
            <FaBarcode className="text-blue-500 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Código: {trials.code || '—'}
            </h4>
          </div>

          {/* Descripción */}
          <div className="flex items-center gap-x-3">
            <FaAlignLeft className="text-blue-300 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Descripción: {trials.description || '—'}
            </h4>
          </div>

          {/* Anotación */}
          <div className="flex items-center gap-x-3">
            <FaStickyNote className="text-blue-200 text-2xl" />
            <h4 className="text-gray-800 font-medium">
              Anotación: {trials.annotation || '—'}
            </h4>
          </div>

          {/* swId */}
          <div className="flex items-center gap-x-3">
            <FaMicrochip className="text-blue-500 text-2xl" />
            <h4 className="text-gray-800 font-medium">swId: {trials.sw.id}</h4>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end items-center gap-x-4 mt-6">
          {/* Botón de Editar */}
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
            aria-label="Editar prueba"
          >
            <AiOutlineEdit className="text-lg" />
          </button>

          {/* Botón de Eliminar */}
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
            aria-label="Eliminar prueba"
          >
            <MdOutlineDelete className="text-lg" />
          </button>
        </div>

        {/* Manejo de Errores */}
        {error && (
          <div className="absolute top-2 right-2 bg-red-200 text-red-700 px-3 py-1 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <EditTrialModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          trialId={trials.id}
          onTrialEdited={handleTrialEdited} // Pasar el manejador de edición
        />
      )}

      {/* Modal de Eliminación */}
      {isDeleteModalOpen && (
        <DeleteTrialModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onTrialDeleted={handleTrialDeleted} // Pasar el manejador de eliminación
          trialId={trials.id}
        />
      )}
    </>
  );
};

export default React.memo(TrialSingleCard);
