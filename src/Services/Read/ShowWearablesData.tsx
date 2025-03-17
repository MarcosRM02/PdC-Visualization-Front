import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import BackButton from '../../Components/CommonComponents/BackButton';
import Spinner from '../../Components/CommonComponents/Spinner';
import { WearableData } from '../../Types/Interfaces';
import WearablesData from '../../Components/WearableData/WearableData';

const ShowWearables = () => {
  const [wearables, setWearables] = useState<WearableData[]>([]);
  const [loading, setLoading] = useState(false);
  const { experimentId, participantId, swId, trialId } = useParams();
  const [searchParams] = useSearchParams();
  const wearableIds = searchParams.getAll('wearableIds');
  const wearableQuery = useMemo(() => {
    return wearableIds
      .map((id) => `wearableIds=${encodeURIComponent(id)}`)
      .join('&');
  }, [wearableIds]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return; // Si no hay token, no ejecutar la llamada.

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    axios
      .get(
        `${apiUrl}/swData/getData/${experimentId}/${participantId}/${swId}/${trialId}?${wearableQuery}`,
        config,
      )
      .then((response) => {
        setWearables(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [experimentId, participantId, swId, trialId, wearableQuery, apiUrl]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Área fija: cabecera, filtros y botones */}
      <div className="p-6">
        {/* Título Principal */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Wearables Data
        </h1>

        {/* Cabecera con Botones de Navegación */}
        <div className="flex justify-between items-center mb-6">
          <BackButton />
        </div>
      </div>
      {/* Contenido Principal */}

      <div className="flex-1 overflow-auto min-h-0 bg-white p-4 pb-24">
        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <Spinner />
          </div>
        ) : wearables.length > 0 ? (
          <WearablesData
            wearables={wearables}
            experimentId={parseInt(experimentId || '0')}
            trialId={parseInt(trialId || '0')}
            participantId={parseInt(participantId || '0')}
            swId={parseInt(swId || '0')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Wearables Data Available
            </h2>
            <p className="text-gray-500 mt-2">
              Please check again after using the device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowWearables;
