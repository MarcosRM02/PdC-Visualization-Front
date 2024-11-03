import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import ParticipantCard from '../../Components/Participants/ParticipantCard';
import { MdOutlineAddBox } from 'react-icons/md';
import { FaSearch, FaUndo } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import LogoutButton from '../../Components/LogoutButton';

const ShowParticipant = () => {
  interface Participant {
    code: string;
    id: number;
  }

  const [sWDatas, setSWDatas] = useState<Participant[]>([]);
  const [filteredSWDatas, setFilteredSWDatas] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchParticipants = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/participants/by-experiment/${id}`,
          config,
        );
        setSWDatas(response.data);
        setFilteredSWDatas(response.data);
      } catch (error) {
        console.error(error);
        setError('Error al cargar los participantes.');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id, accessToken, apiUrl]);

  // Lógica de filtrado
  useEffect(() => {
    let filtered = [...sWDatas];

    // Filtrar por código
    if (searchCode.trim() !== '') {
      filtered = filtered.filter((participant) =>
        participant.code.toLowerCase().includes(searchCode.toLowerCase()),
      );
    }

    setFilteredSWDatas(filtered);
  }, [searchCode, sWDatas]);

  // Función para resetear filtros, memorizada con useCallback
  const resetFilters = useCallback(() => {
    setSearchCode('');
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabecera con Botones de Navegación */}
      <div className="flex justify-between items-center mb-6">
        <BackButton />
        <LogoutButton />
      </div>

      {/* Título Principal */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Participants</h1>

      {/* Sección de Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        {/* Filtro por Código */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar por código..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="bg-transparent focus:outline-none w-full"
            aria-label="Buscar por código"
          />
        </div>

        {/* Botón para Resetear Filtros */}
        <button
          onClick={resetFilters}
          className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          aria-label="Resetear filtros"
        >
          <FaUndo className="mr-2" />
          Resetear
        </button>
      </div>

      {/* Botón para Añadir Participantes */}
      <div className="flex justify-end mb-6">
        <Link
          to={`/participants/create/${id}`}
          className="flex items-center text-sky-800 hover:text-sky-900 transition-colors duration-200"
        >
          <MdOutlineAddBox className="text-4xl mr-2" />
          <span className="text-xl font-semibold">Añadir Participante</span>
        </Link>
      </div>

      {/* Mostrar Errores */}
      {error && (
        <div className="flex items-center justify-center bg-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Contenido Principal */}
      {loading ? (
        <Spinner />
      ) : filteredSWDatas.length > 0 ? (
        <ParticipantCard participants={filteredSWDatas} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Participants Available
          </h2>
          <p className="text-gray-500 mt-2">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
};

// Envolver el componente con React.memo para optimización de rendimiento
export default React.memo(ShowParticipant);
