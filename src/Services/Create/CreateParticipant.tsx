import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/CommonComponents/Spinner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaTimes } from 'react-icons/fa';
import { NumericFormat } from 'react-number-format';
import { useParams } from 'react-router-dom';
import { ICreateModalProps } from '../../Interfaces/Services';

const CreateParticipantModal: React.FC<ICreateModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [footLength, setFootLength] = useState<number | undefined>(undefined);
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>(); // ID del experimento
  const professionalId = localStorage.getItem('professionalId');

  const handleCreateParticipant = async () => {
    // Validaciones básicas
    if (!code.trim()) {
      enqueueSnackbar('El campo "Code" es obligatorio.', {
        variant: 'warning',
      });
      return;
    }

    const dataToSend = {
      ...(name && { name }),
      ...(age && { age: Number(age) }),
      ...(height !== undefined && { height }),
      ...(weight !== undefined && { weight }),
      ...(footLength !== undefined && { footLength }),
    };

    setLoading(true);

    try {
      // Primera solicitud POST para personalData
      const response1 = await axios.post(`personalData`, dataToSend);

      console.log('Respuesta personalData:', response1.data); // Verificar la estructura de la respuesta

      // Verifica que la respuesta contenga el ID de personalData
      let newPersonalDataId: number | undefined;

      if (typeof response1.data === 'object') {
        newPersonalDataId =
          response1.data.id ||
          response1.data.ID ||
          response1.data.personalDataId;
      } else if (typeof response1.data === 'number') {
        newPersonalDataId = response1.data;
      }

      console.log('Nuevo personalData ID:', newPersonalDataId);

      if (!newPersonalDataId) {
        throw new Error('No se obtuvo el ID de personalData en la respuesta.');
      }

      // Segunda solicitud POST para crear el participante utilizando el ID del experimento
      const participantData = {
        code,
        personaldataid: newPersonalDataId,
      };

      console.log('Datos del participante a crear:', participantData);

      await axios.post(
        `/participants/create/${professionalId}/${id}`,
        participantData,
      );
      console.log('Participante creado con éxito ', response1.data);
      setLoading(false);
      enqueueSnackbar('Participant Created successfully', {
        variant: 'success',
      });
      onClose();
      onCreated(); // Notificar al componente padre

      // Limpiar campos
      setCode('');
      setName('');
      setAge('');
      setHeight(undefined);
      setWeight(undefined);
      setFootLength(undefined);
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
      } else if (error.message) {
        enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Error creating the participant', { variant: 'error' });
      }
      console.error('Error creating participant:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Limpiar campos al cerrar el modal
      setCode('');
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
            Crear Participante
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
                placeholder="Ingrese el código del participante"
                required
              />
            </div>

            {/* Campo de Name (Opcional) */}
            <div>
              <label
                className="block text-gray-700 text-lg mb-2"
                htmlFor="name"
              >
                Name <span className="text-gray-500">(opcional)</span>
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
                Age <span className="text-gray-500">(opcional)</span>
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
                Height <span className="text-gray-500">(opcional)</span>
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
                Weight <span className="text-gray-500">(opcional)</span>
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
                Foot Length <span className="text-gray-500">(opcional)</span>
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
              onClick={handleCreateParticipant}
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

export default CreateParticipantModal;
