import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../Components/Spinner';
import ExperimentCard from '../../Components/Experiments/ExperimentCard';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { MdOutlineAddBox } from 'react-icons/md';
import { FaSearch, FaCalendarAlt, FaUndo } from 'react-icons/fa';
import LogoutButton from '../../Components/LogoutButton';

interface Experiment {
  id: number;
  name: string;
  description: string;
  numberOfParticipants: number;
  startDate: string;
  finishDate: string;
}

const ShowExperiment = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [filteredExperiments, setFilteredExperiments] = useState<Experiment[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  // Estados para los filtros
  const [searchName, setSearchName] = useState('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchExperiments = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/experiments/by-professional/${id}`,
          config,
        );
        setExperiments(response.data);
        setFilteredExperiments(response.data);
      } catch (error) {
        console.error(error);
        setError('Error al cargar los experimentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, [id, accessToken, apiUrl]);

  // Función para normalizar la fecha (eliminar la parte de tiempo)
  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Lógica de filtrado
  useEffect(() => {
    let filtered = [...experiments];

    // Filtrar por nombre
    if (searchName.trim() !== '') {
      filtered = filtered.filter((experiment) =>
        experiment.name.toLowerCase().includes(searchName.toLowerCase()),
      );
    }
    // Filtrar por fecha
    if (filterStartDate) {
      const selectedDate = normalizeDate(filterStartDate);
      filtered = filtered.filter((trial) => {
        if (!trial.startDate) return false; // Excluir trials sin fecha

        const trialDate = new Date(trial.startDate);
        if (isNaN(trialDate.getTime())) return false; // Excluir fechas inválidas

        const normalizedTrialDate = normalizeDate(trialDate);

        return normalizedTrialDate.getTime() === selectedDate.getTime();
      });
    }
    // Filtrar por fecha
    if (filterEndDate) {
      const selectedDate = normalizeDate(filterEndDate);
      filtered = filtered.filter((trial) => {
        if (!trial.finishDate) return false; // Excluir trials sin fecha

        const trialDate = new Date(trial.finishDate);
        if (isNaN(trialDate.getTime())) return false; // Excluir fechas inválidas

        const normalizedTrialDate = normalizeDate(trialDate);

        return normalizedTrialDate.getTime() === selectedDate.getTime();
      });
    }

    setFilteredExperiments(filtered);
  }, [searchName, filterStartDate, filterEndDate, experiments]);

  // Función para resetear filtros, memorizada con useCallback
  const resetFilters = useCallback(() => {
    setSearchName('');
    setFilterStartDate(null);
    setFilterEndDate(null);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabecera con Botones de Navegación */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Experiments</h1>
        <LogoutButton />
      </div>

      {/* Sección de Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        {/* Filtro por Nombre */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="bg-transparent focus:outline-none w-full"
            aria-label="Buscar por nombre"
          />
        </div>

        {/* Filtro por Fecha de Inicio */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/4">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <DatePicker
            selected={filterStartDate}
            onChange={(date: Date | null) => setFilterStartDate(date)}
            placeholderText="Fecha de Inicio"
            className="bg-transparent focus:outline-none w-full"
            aria-label="Filtrar por fecha de inicio"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        </div>

        {/* Filtro por Fecha de Finalización */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:w-1/4">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <DatePicker
            selected={filterEndDate}
            onChange={(date: Date | null) => setFilterEndDate(date)}
            placeholderText="Fecha de Finalización"
            className="bg-transparent focus:outline-none w-full"
            aria-label="Filtrar por fecha de finalización"
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

      {/* Botón para Añadir Experimentos */}
      <div className="flex justify-end mb-6">
        <Link
          to={`/experiments/create/${id}`}
          className="flex items-center text-sky-800 hover:text-sky-900 transition-colors duration-200"
        >
          <MdOutlineAddBox className="text-4xl mr-2" />
          <span className="text-xl font-semibold">Añadir Experimento</span>
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
      ) : filteredExperiments.length > 0 ? (
        <ExperimentCard experiments={filteredExperiments} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Experiments Available
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
export default React.memo(ShowExperiment);
