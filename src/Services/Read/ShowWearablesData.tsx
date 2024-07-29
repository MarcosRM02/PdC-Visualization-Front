import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
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

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) return; // Si no hay token, no ejecutar la llamada.

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    axios
      .get(
        `http://172.18.0.6:3000/swData/getData/${experimentId}/${participantId}/${swId}/${trialId}?${wearableQuery}`,
        config,
      )
      .then((response) => {
        setWearables(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [experimentId, participantId, swId, trialId, wearableQuery]);

  return (
    <div className="p-4">
      <BackButton />
      {loading ? (
        <Spinner />
      ) : wearables.length > 0 ? (
        <div>
          <h1 className="text-3xl my-4 font-bold">Wearables Data</h1>
          <div>
            <WearablesData wearables={wearables} />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl my-4 font-bold">
            No Wearables Data Available
          </h1>
        </div>
      )}
    </div>
  );
};

export default ShowWearables;
