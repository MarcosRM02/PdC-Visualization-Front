import React, { useState, useEffect } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { IDeleteModalProps } from '../../Interfaces/Services';

const DeleteParticipantModal: React.FC<IDeleteModalProps> = ({
  isOpen,
  onClose,
  onDeleted,
  id,
}) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDeleteParticipant = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      await axios.delete(`${apiUrl}/participants/delete/${id}`, config);
      setLoading(false);
      enqueueSnackbar('Participante eliminado exitosamente.', {
        variant: 'success',
      });
      onDeleted(); // Notificar al componente padre
      onClose();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error al eliminar el participante.', {
        variant: 'error',
      });
      console.error('Error deleting participant:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Eliminar Participante
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
            <h3 className="text-lg">
              ¿Estás seguro de que deseas eliminar este participante?
            </h3>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteParticipant}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteParticipantModal;
