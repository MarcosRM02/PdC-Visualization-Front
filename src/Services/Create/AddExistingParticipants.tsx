import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { ICreateModalProps } from '../../Interfaces/Services';

const AddExistingParticipantsModal: React.FC<ICreateModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [ids, setIds] = useState<
    { id: number; code: string; personaldataid: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: experimentId } = useParams<{ id: string }>();
  const professionalId = localStorage.getItem('professionalId');

  const [selectedSWIds, setSelectedSWIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchSWIds = async () => {
        try {
          const response = await axios.get(
            `participantTemplates/by-professional/${professionalId}`,
          );
          setIds(response.data);
        } catch (error) {
          enqueueSnackbar('Failed to load Participants', { variant: 'error' });
          console.error('Failed to load Participants', error);
        }
      };

      fetchSWIds();
    }
  }, [enqueueSnackbar, isOpen]);

  const handleSaveTrial = async () => {
    if (selectedSWIds.length === 0) {
      enqueueSnackbar('Please select at least one Participant', {
        variant: 'warning',
      });
      return;
    }

    const selectedParticipants = ids
      .filter((item) => selectedSWIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        code: item.code,
        personaldataid: item.personaldataid,
      }));

    const dataToSend = selectedParticipants;
    setLoading(true);

    try {
      await axios.post(
        `participants/create-multiple/${professionalId}/${experimentId}`,
        dataToSend,
      );
      setLoading(false);
      enqueueSnackbar('Participant Created Successfully', {
        variant: 'success',
      });
      // Limpia los checkboxes seleccionados
      setSelectedSWIds([]);
      onClose();
      onCreated(); // Notificar al componente padre
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error Creating Participant', { variant: 'error' });
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    setSelectedSWIds([]); // Limpia los checkboxes seleccionados
    onClose(); // Llama a la función original de cierre
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add Participants
          </h2>
          <button onClick={handleClose} aria-label="Cerrar modal">
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
              {ids.map((sw) => (
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
                    <div>
                      <strong>Code: </strong>
                      {sw.code}
                    </div>
                  </span>
                </label>
              ))}
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

export default AddExistingParticipantsModal;
