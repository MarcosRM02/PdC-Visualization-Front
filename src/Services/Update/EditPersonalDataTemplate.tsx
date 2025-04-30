import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { NumericFormat } from 'react-number-format';
import { IEditModalProps } from '../../Interfaces/Services';

const EditPersonalDataTemplateModal: React.FC<IEditModalProps> = ({
  isOpen,
  onClose,
  onEdited,
  id,
}) => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [footLength, setFootLength] = useState<number | undefined>(undefined);
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleEditPersonalData = async () => {
    // Construir el objeto de datos con todos los campos
    const data: any = {
      name: name.trim() ? name : '',
      age: age.trim() ? Number(age) : null,
      height: height !== undefined ? height : null,
      weight: weight !== undefined ? weight : null,
      footLength: footLength !== undefined ? footLength : null,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/personalDataTemplate/edit/${id}`,
        data,
        config,
      );
      setLoading(false);
      enqueueSnackbar('Personal Data Edited successfully', {
        variant: 'success',
      });
      onClose();

      // Obtener los datos actualizados desde la respuesta
      const updatedUser = response.data;
      onEdited(updatedUser); // Pasar los datos actualizados al componente padre
    } catch (error: any) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        enqueueSnackbar(`Error: ${error.response.data.message}`, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Error editing personal data', { variant: 'error' });
      }
      console.error('Error editing personal data:', error);
    }
  };

  useEffect(() => {
    if (isOpen && id) {
      const fetchPersonalData = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        setLoading(true);
        try {
          const response = await axios.get(
            `${apiUrl}/personalDataTemplate/${id}`,
            config,
          );
          setName(response.data.name || '');
          setAge(response.data.age ? String(response.data.age) : '');
          setHeight(
            response.data.height !== undefined
              ? response.data.height
              : undefined,
          );
          setWeight(
            response.data.weight !== undefined
              ? response.data.weight
              : undefined,
          );
          setFootLength(
            response.data.footLength !== undefined
              ? response.data.footLength
              : undefined,
          );
          setLoading(false);
        } catch (error) {
          setLoading(false);
          enqueueSnackbar('Error fetching personal data.', {
            variant: 'error',
          });
          console.error('Error fetching personal data:', error);
        }
      };

      fetchPersonalData();
    }
  }, [isOpen, id, accessToken, apiUrl, enqueueSnackbar]);

  useEffect(() => {
    if (!isOpen) {
      // Limpiar campos al cerrar el modal
      setName('');
      setAge('');
      setHeight(undefined);
      setWeight(undefined);
      setFootLength(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-full">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Editar Datos Personales
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="focus:outline-none"
          >
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
            {/* Campo de Name (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese el nombre del participante"
              />
            </div>

            {/* Campo de Age (Opcional) */}
            <div>
              <label className="block text-gray-700 text-lg mb-2" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="Ingrese la edad del participante"
                min="1" // Evita números menores que 1
                step="1" // Solo permite números enteros
              />
            </div>

            {/* Campo de Height (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="height"
              >
                Height
              </label>
              <NumericFormat
                id="height"
                value={height}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setHeight(floatValue);
                }}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                decimalSeparator="."
                thousandSeparator={false}
                placeholder="Enter height in meters"
              />
            </div>

            {/* Campo de Weight (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="weight"
              >
                Weight
              </label>
              <NumericFormat
                id="weight"
                value={weight}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setWeight(floatValue);
                }}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                decimalSeparator="."
                thousandSeparator={false}
                placeholder="Enter weight in kg"
              />
            </div>

            {/* Campo de Foot Length (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="footLength"
              >
                Foot Length
              </label>
              <NumericFormat
                id="footLength"
                value={footLength}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setFootLength(floatValue);
                }}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                decimalSeparator="."
                thousandSeparator={false}
                placeholder="Enter foot length in cm"
              />
            </div>

            {/* Botón de Guardar */}
            <button
              onClick={handleEditPersonalData}
              className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors duration-200"
              disabled={loading} // Deshabilitar mientras carga
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPersonalDataTemplateModal;
