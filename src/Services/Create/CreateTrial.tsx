import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { ICreateModalProps } from '../../Interfaces/Services';

const CreateTrialModal: React.FC<ICreateModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [description, setDescription] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [code, setCode] = useState('');
  const [swId, setSWId] = useState('');
  const [swIds, setSWIds] = useState<{ id: number; description: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (isOpen) {
      const fetchSWIds = async () => {
        try {
          const response = await axios.get(`sw`);
          setSWIds(response.data);
        } catch (error) {
          enqueueSnackbar('Error fetching SW IDs', { variant: 'error' });
          console.error('Error fetching SW IDs:', error);
        }
      };

      fetchSWIds();
    }
  }, [enqueueSnackbar, isOpen]);

  const handleSaveTrial = async () => {
    if (!swId) {
      enqueueSnackbar('Please select a valid SW ID before continuing.', {
        variant: 'warning',
      });
      return;
    }

    const dataToSend: { [key: string]: string | number } = {
      swId: Number(swId),
      participantId: Number(id),
      ...(description && { description }),
      ...(code && { code }),
      ...(annotation && { annotation }),
    };

    setLoading(true);

    try {
      await axios.post(`trials/create`, dataToSend);
      setLoading(false);
      enqueueSnackbar('Trial created successfully', { variant: 'success' });
      onClose();
      onCreated(); // Notificar al componente padre
      // Limpiar campos
      setDescription('');
      setAnnotation('');
      setCode('');
      setSWId('');
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('An error occurred while creating the trial', {
        variant: 'error',
      });
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
          <h2 className="text-2xl font-semibold text-gray-800">Create Tial</h2>
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
                SW (ID - Description) <span className="text-red-500">*</span>
              </label>
              <select
                id="swId"
                value={swId}
                onChange={(e) => setSWId(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                required
              >
                <option value="">Select SW</option>
                {swIds.map((sw) => (
                  <option key={sw.id} value={sw.id}>
                    {sw.id} - {sw.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de Código (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="code"
              >
                Code <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Enter the trial code"
              />
            </div>

            {/* Campo de Descripción (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="description"
              >
                Description <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Enter the trial description"
              />
            </div>

            {/* Campo de Anotaciones (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="annotation"
              >
                Notes <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                id="annotation"
                type="text"
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Enter some annotation"
              />
            </div>

            <div className="flex justify-end space-x-4">
              {/* Botón de Cancelar */}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              {/* Botón de Guardar */}
              <button
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={handleSaveTrial}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTrialModal;
