import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';

interface CreateTrialTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrialCreated: () => void; // Callback para notificar al padre
}

const CreateTrialTemplateModal: React.FC<CreateTrialTemplateModalProps> = ({
  isOpen,
  onClose,
  onTrialCreated,
}) => {
  const [description, setDescription] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [code, setCode] = useState('');
  const [swId, setSWId] = useState('');
  const [swIds, setSWIds] = useState<{ id: number; description: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      const fetchSWIds = async () => {
        try {
          const response = await axios.get(`${apiUrl}/sw`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
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
    if (!swId) {
      enqueueSnackbar(
        'Por favor, selecciona un SW ID válido antes de continuar.',
        {
          variant: 'warning',
        },
      );
      return;
    }

    const dataToSend: { [key: string]: string | number } = {
      swId: Number(swId),
      templateId: Number(id),
      ...(description && { description }),
      ...(code && { code }),
      ...(annotation && { annotation }),
    };
    console.log('Data to send:', dataToSend);

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    setLoading(true);

    try {
      await axios.post(`${apiUrl}/trialTemplates/create`, dataToSend, config);
      setLoading(false);
      enqueueSnackbar('Template creada exitosamente', { variant: 'success' });
      onClose();
      onTrialCreated(); // Notificar al componente padre
      // Limpiar campos
      setDescription('');
      setAnnotation('');
      setCode('');
      setSWId('');
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error al crear la template', { variant: 'error' });
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Limpiar campos al cerrar el modal
      setDescription('');
      setAnnotation('');
      setCode('');
      setSWId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Crear Template
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
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="swId"
              >
                SW (ID - Descripción) <span className="text-red-500">*</span>
              </label>
              <select
                id="swId"
                value={swId}
                onChange={(e) => setSWId(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                required
              >
                <option value="">Seleccionar SW</option>
                {swIds.map((sw) => (
                  <option key={sw.id} value={sw.id}>
                    {sw.id} - {sw.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de Descripción (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="description"
              >
                Descripción <span className="text-gray-500">(opcional)</span>
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese la descripción"
              />
            </div>

            {/* Campo de Código (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="code"
              >
                Código <span className="text-gray-500">(opcional)</span>
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese el código"
              />
            </div>

            {/* Campo de Anotaciones (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="annotation"
              >
                Anotaciones <span className="text-gray-500">(opcional)</span>
              </label>
              <input
                id="annotation"
                type="text"
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese las anotaciones"
              />
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

export default CreateTrialTemplateModal;
