import React, { useState, useEffect } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { IEditModalProps } from '../../Interfaces/Services';

const EditParticipantModal: React.FC<IEditModalProps> = ({
  isOpen,
  onClose,
  onEdited,
  id,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isOpen) return;

    const fetchParticipant = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`participants/${id}`);
        setCode(response.data.code);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('An error occurred while loading the participant');
        enqueueSnackbar('An error occurred while loading the participant', {
          variant: 'error',
        });
        console.error(err);
      }
    };

    fetchParticipant();
  }, [isOpen, id, enqueueSnackbar]);

  const handleEditParticipant = async () => {
    if (!code.trim()) {
      enqueueSnackbar('"Code" field is required', {
        variant: 'warning',
      });
      return;
    }

    const data = { code };

    setLoading(true);
    try {
      await axios.put(`participants/edit/${id}`, data);
      setLoading(false);
      enqueueSnackbar('Participant successfully edited', {
        variant: 'success',
      });
      onClose();
      onEdited(); // Notificar al componente padre
    } catch (err) {
      setLoading(false);
      enqueueSnackbar('An error occurred while editing the participant', {
        variant: 'error',
      });
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Limpiar campos al cerrar el modal
      setCode('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Participant
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="focus:outline-none"
          >
            <FaTimes className="text-red-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* Contenido del Modal */}
        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {/* Campo de Code (Requerido) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="code"
              >
                Code <span className="text-red-500">*</span>
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Enter the participant code"
                required
              />
            </div>

            {/* Mostrar Errores */}
            {error && (
              <div className="flex items-center justify-center bg-red-200 text-red-700 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Botón de Guardar */}
            <button
              onClick={handleEditParticipant}
              className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditParticipantModal;
