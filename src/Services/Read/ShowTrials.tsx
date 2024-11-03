import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import TrialCard from '../../Components/Trials/TrialCard';
import { MdOutlineAddBox } from 'react-icons/md';
import { FaSearch, FaUndo, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LogoutButton from '../../Components/LogoutButton';

const ShowTrials = () => {
  const [sWDatas, setSWDatas] = useState<any[]>([]);
  const [filteredSWDatas, setFilteredSWDatas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null); // Cambio aquí
  const [error, setError] = useState('');
  const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTrials = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/trials/by-participant/${id}`,
          config,
        );
        setSWDatas(response.data);
        setFilteredSWDatas(response.data);
      } catch (error) {
        console.error(error);
        setError('Error al cargar los trials.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, [id, accessToken, apiUrl]);

  // Función para normalizar la fecha (eliminar la parte de tiempo)
  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Lógica de filtrado
  useEffect(() => {
    let filtered = [...sWDatas];

    // Filtrar por código
    if (searchCode.trim() !== '') {
      filtered = filtered.filter((trial) =>
        trial.code.toLowerCase().includes(searchCode.toLowerCase()),
      );
    }

    // Filtrar por fecha
    if (filterDate) {
      const selectedDate = normalizeDate(filterDate);
      filtered = filtered.filter((trial) => {
        if (!trial.date) return false; // Excluir trials sin fecha

        const trialDate = new Date(trial.date);
        if (isNaN(trialDate.getTime())) return false; // Excluir fechas inválidas

        const normalizedTrialDate = normalizeDate(trialDate);

        return normalizedTrialDate.getTime() === selectedDate.getTime();
      });
    }

    setFilteredSWDatas(filtered);
  }, [searchCode, filterDate, sWDatas]);

  // Función para resetear filtros, memorizada con useCallback
  const resetFilters = useCallback(() => {
    setSearchCode('');
    setFilterDate(null);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabecera con Botones de Navegación */}
      <div className="flex justify-between items-center mb-6">
        <BackButton />
        <LogoutButton />
      </div>

      {/* Título Principal */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Trials</h1>

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

        {/* Filtro por Fecha */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/4">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <DatePicker
            selected={filterDate}
            onChange={(date: Date | null) => setFilterDate(date)}
            placeholderText="Filtrar por fecha"
            className="bg-transparent focus:outline-none w-full"
            aria-label="Filtrar por fecha"
            dateFormat="dd/MM/yyyy"
            isClearable
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

      {/* Botón para Añadir Trials */}
      <div className="flex justify-end mb-6">
        <Link
          to={`/trials/create/${id}`}
          className="flex items-center text-sky-800 hover:text-sky-900 transition-colors duration-200"
        >
          <MdOutlineAddBox className="text-4xl mr-2" />
          <span className="text-xl font-semibold">Añadir Trial</span>
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
        <TrialCard trials={filteredSWDatas} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Trials Available
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
export default React.memo(ShowTrials);
