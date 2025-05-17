import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { ICreateModalProps } from '../../Interfaces/Services';

const CreateTemplateModal: React.FC<ICreateModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();

  const handleSaveTrial = async () => {
    if (!name.trim()) {
      enqueueSnackbar('Por favor, completa todos los campos requeridos.', {
        variant: 'warning',
      });
      return;
    }
    const dataToSend: { [key: string]: string | number } = {
      professionalId: Number(id),
      name,
      ...(description && { description }),
    };

    setLoading(true);

    try {
      await axios.post(`templates/create`, dataToSend);
      setLoading(false);
      enqueueSnackbar('Template creada exitosamente', { variant: 'success' });
      onClose();
      onCreated(); // Notificar al componente padre
      // Limpiar campos
      setDescription('');
      setName('');
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
      setName('');
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
            {/* Campo de Código (Requerido) */}
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
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese la descripción"
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

export default CreateTemplateModal;
