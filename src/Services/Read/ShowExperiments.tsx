import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Spinner from '../../Components/CommonComponents/Spinner';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { MdOutlineAddBox } from 'react-icons/md';
import { FaSearch, FaCalendarAlt, FaUndo } from 'react-icons/fa';
import CreateExperimentModal from '../Create/CreateExperiment';
import EditExperimentModal from '../Update/EditExperiment';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ExperimentCard from '../../Components/Experiments/ExperimentCard';
import Breadcrumb from '../../Components/CommonComponents/Breadcrumb';
import { IBreadcrumbItem } from '../../Interfaces/BreadcrumbInterfaces';
import { IExperiment } from '../../Interfaces/Experiments';

const breadcrumbItems: IBreadcrumbItem[] = [
  { label: 'Experimentos', path: '/' },
];

const ShowExperiment = () => {
  const [experiments, setExperiments] = useState<IExperiment[]>([]);
  const [filteredExperiments, setFilteredExperiments] = useState<IExperiment[]>(
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

  // Estados para los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExperimentId, setSelectedExperimentId] = useState<
    number | null
  >(null);

  const { enqueueSnackbar } = useSnackbar();

  const fetchExperiments = useCallback(async () => {
    if (!id) return;
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
      setError('');
    } catch (error) {
      console.error(error);
      setError('Error al cargar los experimentos.');
      enqueueSnackbar('Error al cargar los experimentos.', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [id, accessToken, apiUrl, enqueueSnackbar]);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  useEffect(() => {
    let filtered = [...experiments];

    if (searchName.trim() !== '') {
      filtered = filtered.filter((experiment) =>
        experiment.name.toLowerCase().includes(searchName.toLowerCase()),
      );
    }
    if (filterStartDate) {
      const selectedDate = normalizeDate(filterStartDate);
      filtered = filtered.filter((trial) => {
        if (!trial.startDate) return false;
        const trialDate = new Date(trial.startDate);
        if (isNaN(trialDate.getTime())) return false;
        const normalizedTrialDate = normalizeDate(trialDate);
        return normalizedTrialDate.getTime() === selectedDate.getTime();
      });
    }
    if (filterEndDate) {
      const selectedDate = normalizeDate(filterEndDate);
      filtered = filtered.filter((trial) => {
        if (!trial.finishDate) return false;
        const trialDate = new Date(trial.finishDate);
        if (isNaN(trialDate.getTime())) return false;
        const normalizedTrialDate = normalizeDate(trialDate);
        return normalizedTrialDate.getTime() === selectedDate.getTime();
      });
    }

    setFilteredExperiments(filtered);
  }, [searchName, filterStartDate, filterEndDate, experiments]);

  const resetFilters = useCallback(() => {
    setSearchName('');
    setFilterStartDate(null);
    setFilterEndDate(null);
  }, []);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedExperimentId(null);
  };

  const handleExperimentChanged = useCallback(() => {
    fetchExperiments();
  }, [fetchExperiments]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Área fija: cabecera, filtros y botones */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Experimentos</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
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

          <button
            onClick={resetFilters}
            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            aria-label="Resetear filtros"
          >
            <FaUndo className="mr-2" />
            Resetear
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={openCreateModal}
            className="flex items-center text-sky-900 hover:text-blue-800 transition-colors duration-200"
          >
            <MdOutlineAddBox className="text-4xl mr-2" />
          </button>
        </div>

        {error && (
          <div className="flex items-center justify-center bg-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Área scrollable: lista de experimentos */}
      <div className="flex-1 overflow-auto min-h-0 bg-white p-4 pb-24">
        {loading ? (
          <Spinner />
        ) : filteredExperiments.length > 0 ? (
          <ExperimentCard
            experiments={filteredExperiments}
            onExperimentDeleted={handleExperimentChanged}
            onExperimentEdited={handleExperimentChanged}
          />
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

      {/* Modales */}
      <CreateExperimentModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreated={handleExperimentChanged}
      />

      {selectedExperimentId !== null && (
        <EditExperimentModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          id={selectedExperimentId}
          onEdited={handleExperimentChanged}
        />
      )}
    </div>
  );
};

export default React.memo(ShowExperiment);
