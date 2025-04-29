import React, { useState, useEffect } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { IEditModalProps } from '../../Interfaces/Services';
import { ITemplate } from '../../Interfaces/Trials';

const EditTrialTemplate: React.FC<IEditModalProps> = ({
  isOpen,
  onClose,
  onEdited,
  id,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isOpen) return;

    const fetchTrial = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/templates/${id}`, config);
        setName(response.data.name);
        setDescription(response.data.description || '');
      } catch (error) {
        enqueueSnackbar('Ocurrió un error al cargar los datos del trial.', {
          variant: 'error',
        });
        console.error('Error fetching trial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrial();
  }, [isOpen, id, accessToken, apiUrl, enqueueSnackbar]);

  const handleEditTemplate = async () => {
    // Validaciones básicas
    if (!name.trim()) {
      enqueueSnackbar('Por favor, completa todos los campos requeridos.', {
        variant: 'warning',
      });
      return;
    }

    const data: ITemplate = {
      name: name.trim(),
      description: description.trim() !== '' ? description.trim() : null,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    try {
      await axios.put(`${apiUrl}/templates/edit/${id}`, data, config);
      enqueueSnackbar('Template editado exitosamente', {
        variant: 'success',
      });
      onClose();
      onEdited(); // Notificar al componente padre
    } catch (error) {
      enqueueSnackbar('Error al editar el Template.', { variant: 'error' });
      console.error('Error editing Template:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Limpiar campos al cerrar el modal
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Editar Template
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
                placeholder="Ingrese el nombre del template"
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
                placeholder="Ingrese la descripción del template"
                rows={4}
              />
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              {/* Botón de Cancelar */}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancelar
              </button>

              {/* Botón de Guardar */}
              <button
                onClick={handleEditTemplate}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTrialTemplate;
