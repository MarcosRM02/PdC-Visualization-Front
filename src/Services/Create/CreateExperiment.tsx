// src/Components/Experiments/CreateExperimentModal.tsx

import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExperimentCreated: () => void; // Callback para notificar al padre
}

const CreateExperimentModal: React.FC<CreateExperimentModalProps> = ({
  isOpen,
  onClose,
  onExperimentCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSaveExperiment = async () => {
    // Validaciones básicas (Descripción es opcional)
    if (!name.trim() || !startDate) {
      enqueueSnackbar('Por favor, completa todos los campos requeridos.', {
        variant: 'warning',
      });
      return;
    }

    const data: { [key: string]: string } = {
      name,
      description, // Puede estar vacío
      startDate,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/experiments/create/${id}`, data, config);
      setLoading(false);
      enqueueSnackbar('Experimento creado exitosamente', {
        variant: 'success',
      });
      onClose();
      onExperimentCreated(); // Notificar al componente padre
      // Limpiar campos
      setName('');
      setDescription('');
      setStartDate('');
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error al crear el experimento', { variant: 'error' });
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setStartDate('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Crear Experimento
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
            {/* Campo de Nombre (Requerido) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="name"
              >
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese el nombre del experimento"
                required
              />
            </div>

            {/* Campo de Descripción (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="description"
              >
                Descripción <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese la descripción del experimento"
                rows={4}
              />
            </div>

            {/* Campo de Fecha de Inicio (Requerido) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="startDate"
              >
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                required
              />
            </div>
            <button
              onClick={handleSaveExperiment}
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

export default CreateExperimentModal;
