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
import { useEffect, useState } from 'react';

const TrialSingleCard = ({ trials }: { trials: any }) => {
  const [data, setData] = useState({
    experimentId: null,
    wearablesIds: [],
  });
  const [error, setError] = useState('');
  const participantId = trials.participant.id;
  const swId = trials.sw.id;

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
  }, [participantId, swId]);

  const navigate = useNavigate();

  const handleEditClick = (event: any) => {
    event.stopPropagation();
    navigate(`/trials/edit/${trials.id}`);
  };

  const handleDeleteClick = (event: any) => {
    event.stopPropagation();
    navigate(`/trials/delete/${trials.id}`);
  };

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

  return (
    <div
      onClick={() => navigate(detailsUrl)}
      className="border-2 border-gray-500 rounded-lg px-6 py-4 m-4 relative hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer bg-white"
    >
      <div key={trials.id} className="my-2 space-y-3">
        {/* ID */}
        <div className="flex items-center gap-x-3">
          <FaIdCard className="text-red-400 text-xl" />
          <h4 className="text-gray-700 font-medium">ID: {trials.id}</h4>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-x-3">
          <FaCalendarAlt className="text-blue-400 text-xl" />
          <h4 className="text-gray-700 font-medium">
            Fecha: {formattedDate || '—'}
          </h4>
        </div>

        {/* Código */}
        <div className="flex items-center gap-x-3">
          <FaBarcode className="text-green-400 text-xl" />
          <h4 className="text-gray-700 font-medium">
            Código: {trials.code || '—'}
          </h4>
        </div>

        {/* Descripción */}
        <div className="flex items-center gap-x-3">
          <FaAlignLeft className="text-purple-400 text-xl" />
          <h4 className="text-gray-700 font-medium">
            Descripción: {trials.description || '—'}
          </h4>
        </div>

        {/* Anotación */}
        <div className="flex items-center gap-x-3">
          <FaStickyNote className="text-yellow-400 text-xl" />
          <h4 className="text-gray-700 font-medium">
            Anotación: {trials.annotation || '—'}
          </h4>
        </div>

        {/* swId */}
        <div className="flex items-center gap-x-3">
          <FaMicrochip className="text-indigo-400 text-xl" />
          <h4 className="text-gray-700 font-medium">swId: {trials.sw.id}</h4>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end items-center gap-x-4 mt-6">
        {/* Botón de Editar */}
        <button
          onClick={handleEditClick}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-200"
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
        <div className="absolute top-2 right-2 bg-red-100 text-red-700 px-3 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default TrialSingleCard;
