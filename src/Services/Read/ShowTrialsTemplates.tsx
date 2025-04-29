import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from '../../Components/CommonComponents/Spinner';
import TrialTemplateCard from '../../Components/Trials Templates/TrialTemplateCard';
import { MdOutlineAddBox } from 'react-icons/md';
import { FaSearch, FaUndo, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSnackbar } from 'notistack';
import CreateTrialTemplateModal from '../Create/CreateTrialTemplate';
import Breadcrumb from '../../Components/CommonComponents/Breadcrumb';
import { IBreadcrumbItem } from '../../Interfaces/BreadcrumbInterfaces';

const ShowTrialsTemplates = () => {
  const [sWDatas, setSWDatas] = useState<any[]>([]);
  const [filteredSWDatas, setFilteredSWDatas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Estado para el modal de creación

  // Nuevo estado para controlar el refresco de datos
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const { id } = useParams<{ id: string }>();

  const accessToken = localStorage.getItem('accessToken');
  const professionalId = localStorage.getItem('id');
  const apiUrl = import.meta.env.VITE_API_URL;
  const { enqueueSnackbar } = useSnackbar();

  // Callback para manejar la edición de una prueba
  const handleTrialEdited = useCallback(() => {
    setRefreshTrigger((prev) => !prev);
  }, [enqueueSnackbar]);

  // Callback para manejar la eliminación de una prueba
  const handleTrialDeleted = useCallback(() => {
    setRefreshTrigger((prev) => !prev);
  }, [enqueueSnackbar]);

  // Callback para manejar la creación de una prueba
  const handleTrialCreated = useCallback(() => {
    setRefreshTrigger((prev) => !prev);
  }, [enqueueSnackbar]);

  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      label: 'Templates',
      path: `/templates/by-professional/${professionalId}`,
    },
    { label: 'Trial Templates', path: `/trialTemplates/by-professional/${id}` },
  ];

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
          `${apiUrl}/trialTemplates/by-professional/${id}`,
          config,
        );
        let trialsData = response.data;
        // Ordenar los trials por fecha de manera ascendente
        trialsData.sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        setSWDatas(trialsData);
        setFilteredSWDatas(trialsData);
      } catch (error) {
        console.error(error);
        setError('Error al cargar los templates.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, [id, accessToken, apiUrl, refreshTrigger]); // Añadido refreshTrigger

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
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Área fija: cabecera, filtros y botones */}
      <div className="p-6">
        {/* Título Principal */}
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Trial Templates
        </h1>
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

        {/* Botón para Abrir el Modal de Crear Trial */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center text-sky-800 hover:text-sky-900 transition-colors duration-200"
          >
            <MdOutlineAddBox className="text-4xl mr-2" />
          </button>
        </div>

        {/* Mostrar Errores */}
        {error && (
          <div className="flex items-center justify-center bg-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
      </div>
      {/* Contenido Principal */}
      <div className="flex-1 overflow-auto min-h-0 bg-white p-4 pb-24">
        {loading ? (
          <Spinner />
        ) : filteredSWDatas.length > 0 ? (
          // Pasar ambos manejadores de edición y eliminación a TrialCard
          <TrialTemplateCard
            trials={filteredSWDatas}
            onTrialEdited={handleTrialEdited}
            onTrialDeleted={handleTrialDeleted}
          />
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Templates Available
            </h2>
            <p className="text-gray-500 mt-2">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}

        {/* Modal de Creación */}
        {isCreateModalOpen && (
          <CreateTrialTemplateModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreated={handleTrialCreated}
          />
        )}
      </div>
    </div>
  );
};

// Envolver el componente con React.memo para optimización de rendimiento
export default React.memo(ShowTrialsTemplates);
