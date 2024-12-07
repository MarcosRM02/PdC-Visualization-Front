// src/Pages/Participants/ShowParticipant.tsx

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Spinner from '../../Components/Spinner';
import { MdOutlineAddBox } from 'react-icons/md';
import { FaSearch, FaUndo } from 'react-icons/fa';
import LogoutButton from '../../Components/LogoutButton';
import BackButton from '../../Components/BackButton';
import ParticipantCard from '../../Components/Participants/ParticipantCard';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import 'react-datepicker/dist/react-datepicker.css';
import CreateParticipantModal from '../../Services/Create/CreateParticipant'; // Importa el modal de creación

interface Participant {
  id: number;
  code: string;
  personalData?: {
    id: number;
  };
}
const ShowParticipant = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [error, setError] = useState('');

  const { id } = useParams<{ id: string }>(); // ID del experimento
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const { enqueueSnackbar } = useSnackbar();

  // Estados para el modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Función para obtener los participantes
  const fetchParticipants = useCallback(async () => {
    if (!id) return;
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
      let participantsData: Participant[] = response.data;

      // Ordenar los participantes por ID de manera ascendente
      participantsData.sort((a, b) => a.id - b.id);

      setParticipants(participantsData);
      setFilteredParticipants(participantsData);
      setError('');
    } catch (error: any) {
      console.error(error);
      setError('Error al cargar los participantes.');
      enqueueSnackbar('Error al cargar los participantes.', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [id, accessToken, apiUrl, enqueueSnackbar]);

  // Obtener los participantes al montar el componente
  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Lógica de filtrado
  useEffect(() => {
    let filtered = [...participants];

    // Filtrar por código
    if (searchCode.trim() !== '') {
      filtered = filtered.filter((participant) =>
        participant.code.toLowerCase().includes(searchCode.toLowerCase()),
      );
    }

    setFilteredParticipants(filtered);
  }, [searchCode, participants]);

  // Función para resetear filtros, memorizada con useCallback
  const resetFilters = useCallback(() => {
    setSearchCode('');
  }, []);

  // Funciones para manejar la eliminación y edición
  const handleParticipantDeleted = useCallback(() => {
    fetchParticipants(); // Volver a obtener la lista actualizada
  }, [fetchParticipants]);

  const handleParticipantEdited = useCallback(() => {
    fetchParticipants(); // Volver a obtener la lista actualizada
  }, [fetchParticipants]);

  // Funciones para abrir y cerrar el modal de creación
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

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

      {/* Botón para Abrir el Modal de Creación */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openCreateModal}
          className="flex items-center text-sky-800 hover:text-sky-900 transition-colors duration-200"
        >
          <MdOutlineAddBox className="text-4xl mr-2" />
          <span className="text-xl font-semibold">Añadir Participante</span>
        </button>
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
      ) : filteredParticipants.length > 0 ? (
        <ParticipantCard
          participants={filteredParticipants}
          onParticipantDeleted={handleParticipantDeleted} // Pasar el callback
          onParticipantEdited={handleParticipantEdited} // Pasar el nuevo callback
        />
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

      {/* Modal de Crear Participante */}
      <CreateParticipantModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onParticipantCreated={handleParticipantEdited} // Pasar el callback
      />
    </div>
  );
};

// Envolver el componente con React.memo para optimización de rendimiento
export default React.memo(ShowParticipant);
