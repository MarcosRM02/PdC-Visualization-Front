import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import Spinner from '../../Components/CommonComponents/Spinner';
import { IWearableData } from '../../Interfaces/DataPanel';
import WearablesData from '../../Components/WearableData/WearableData';
import Breadcrumb from '../../Components/CommonComponents/Breadcrumb';
import { IBreadcrumbItem } from '../../Interfaces/BreadcrumbInterfaces';

const ShowWearables = () => {
  const [wearables, setWearables] = useState<IWearableData[]>([]);
  const [loading, setLoading] = useState(false);
  const { experimentId, participantId, swId, trialId } = useParams();
  const [searchParams] = useSearchParams();
  const wearableIds = searchParams.getAll('wearableIds');
  const professionalId = localStorage.getItem('id');
  const wearableQuery = useMemo(() => {
    return wearableIds
      .map((id) => `wearableIds=${encodeURIComponent(id)}`)
      .join('&');
  }, [wearableIds]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      label: 'Experimentos',
      path: `/experiments/by-professional/${professionalId}`,
    },
    {
      label: 'Participantes',
      path: `/participants/by-experiment/${experimentId}`,
    },
    { label: 'Trials', path: `/trials/by-participant/${participantId}` },
    {
      label: 'Wearables Data',
      path: `/swData/getData/${experimentId}/${participantId}/${swId}/${trialId}?${wearableQuery}`,
    },
  ];

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
      <div className="flex justify-between items-center ">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <Spinner />
          </div>
        ) : wearables.length > 0 ? (
          <WearablesData
            wearables={wearables}
            experimentId={parseInt(experimentId || '-1')}
            trialId={parseInt(trialId || '-1')}
            participantId={parseInt(participantId || '-1')}
            swId={parseInt(swId || '-1')}
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
