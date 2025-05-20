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

  useEffect(() => {
    if (!isOpen) return;

    const fetchTrial = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`templates/${id}`);
        setName(response.data.name);
        setDescription(response.data.description || '');
      } catch (error) {
        enqueueSnackbar('An error occurred while loading trial', {
          variant: 'error',
        });
        console.error('Error fetching trial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrial();
  }, [isOpen, id, enqueueSnackbar]);

  const handleEditTemplate = async () => {
    // Validaciones básicas
    if (!name.trim()) {
      enqueueSnackbar('Please complete all required fields', {
        variant: 'warning',
      });
      return;
    }

    const data: ITemplate = {
      name: name.trim(),
      description: description.trim() !== '' ? description.trim() : null,
    };

    setLoading(true);
    try {
      await axios.put(`templates/edit/${id}`, data);
      enqueueSnackbar('Template Edited successfully', {
        variant: 'success',
      });
      onClose();
      onEdited(); // Notificar al componente padre
    } catch (error) {
      enqueueSnackbar('An error occurred while editing the template.', {
        variant: 'error',
      });
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
            Edit Template
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
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Enter the template name"
                required
              />
            </div>

            {/* Campo de Descripción (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="description"
              >
                Description <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Enter the template description"
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
                Cancel
              </button>

              {/* Botón de Guardar */}
              <button
                onClick={handleEditTemplate}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
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

export default EditTrialTemplate;
