// src/Components/Experiments/EditExperimentModal.tsx

import React, { useState, useEffect } from 'react';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';

interface EditExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId: number;
  onExperimentEdited: () => void; // Callback para notificar al padre
}

const EditExperimentModal: React.FC<EditExperimentModalProps> = ({
  isOpen,
  onClose,
  experimentId,
  onExperimentEdited,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isOpen) return;

    const fetchExperiment = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/experiments/${experimentId}`,
          config,
        );
        setName(response.data.name);
        setDescription(response.data.description);
        const formattedStartDate = new Date(response.data.startDate)
          .toISOString()
          .split('T')[0];
        setStartDate(formattedStartDate);
        if (response.data.finishDate === null) {
          setFinishDate('');
        } else {
          const formattedFinishDate = new Date(response.data.finishDate)
            .toISOString()
            .split('T')[0];
          setFinishDate(formattedFinishDate);
        }
        setNotes(response.data.notes);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        enqueueSnackbar(
          'Ocurrió un error al cargar los datos del experimento.',
          { variant: 'error' },
        );
        console.error(error);
      }
    };

    fetchExperiment();
  }, [isOpen, experimentId, accessToken, apiUrl, enqueueSnackbar]);

  const handleEditExperiment = async () => {
    // Validaciones básicas
    if (!name.trim() || !startDate) {
      enqueueSnackbar('Por favor, completa todos los campos requeridos.', {
        variant: 'warning',
      });
      return;
    }

    const data = {
      name,
      description,
      startDate,
      finishDate: finishDate
        ? new Date(finishDate).toISOString().split('T')[0]
        : null,
      notes,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    try {
      await axios.put(
        `${apiUrl}/experiments/edit/${experimentId}`,
        data,
        config,
      );
      setLoading(false);
      enqueueSnackbar('Experimento editado exitosamente', {
        variant: 'success',
      });
      onClose();
      onExperimentEdited(); // Notificar al componente padre
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error al editar el experimento.', { variant: 'error' });
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Limpiar campos al cerrar el modal
      setName('');
      setDescription('');
      setStartDate('');
      setFinishDate('');
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Editar Experimento
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
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

            {/* Campo de Fecha de Finalización (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="finishDate"
              >
                Fecha de Finalización{' '}
                <span className="text-gray-500">(opcional)</span>
              </label>
              <input
                id="finishDate"
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Campo de Notas (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="notes"
              >
                Notas <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese las notas del experimento"
                rows={4}
              />
            </div>

            {/* Botón de Guardar */}
            <button
              onClick={handleEditExperiment}
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

export default EditExperimentModal;
