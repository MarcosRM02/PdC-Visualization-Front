import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';

interface AddExistingParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrialCreated: () => void; // Callback para notificar al padre
}

const AddExistingParticipantsModal: React.FC<
  AddExistingParticipantsModalProps
> = ({ isOpen, onClose, onTrialCreated }) => {
  const [swIds, setSWIds] = useState<
    { id: number; code: string; personaldataid: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: experimentId } = useParams<{ id: string }>();
  const professionalId = localStorage.getItem('id');
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedSWIds, setSelectedSWIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchSWIds = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/participantTemplates/by-professional/${professionalId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setSWIds(response.data);
        } catch (error) {
          enqueueSnackbar('Error al obtener los SW IDs', { variant: 'error' });
          console.error('Error fetching SW IDs:', error);
        }
      };

      fetchSWIds();
    }
  }, [apiUrl, accessToken, enqueueSnackbar, isOpen]);

  const handleSaveTrial = async () => {
    if (selectedSWIds.length === 0) {
      enqueueSnackbar('Por favor, selecciona al menos un participante.', {
        variant: 'warning',
      });
      return;
    }

    const selectedParticipants = swIds
      .filter((item) => selectedSWIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        code: item.code,
        personaldataid: item.personaldataid,
      }));

    const dataToSend = selectedParticipants;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    setLoading(true);

    try {
      await axios.post(
        `${apiUrl}/participants/create-multiple/${professionalId}/${experimentId}`,
        dataToSend,
        config,
      );
      setLoading(false);
      enqueueSnackbar('Prueba creada exitosamente', { variant: 'success' });
      onClose();
      onTrialCreated(); // Notificar al componente padre
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error al crear la prueba', { variant: 'error' });
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Añadir Participantes
          </h2>
          <button onClick={onClose} aria-label="Cerrar modal">
            <FaTimes className="text-red-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Contenido del Modal */}
        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {/* Selección de SW */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {swIds.map((sw) => (
                <label
                  key={sw.id}
                  className="flex items-center space-x-2 p-2 rounded-md border bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={sw.id}
                    checked={selectedSWIds.includes(sw.id)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setSelectedSWIds((prev) =>
                        prev.includes(value)
                          ? prev.filter((id) => id !== value)
                          : [...prev, value],
                      );
                    }}
                    className="form-checkbox h-4 w-4 text-sky-600"
                  />
                  <span className="text-gray-700">
                    {sw.id} - {sw.code}
                  </span>
                </label>
              ))}
            </div>

            {/* Botón de Guardar */}
            <button
              onClick={handleSaveTrial}
              className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddExistingParticipantsModal;
