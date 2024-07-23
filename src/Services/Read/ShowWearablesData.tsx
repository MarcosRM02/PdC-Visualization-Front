import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import { WearableData } from '../../Types/Interfaces';
import WearablesData from '../../Components/WearableData/WearableData';

const ShowWearables = () => {
  const [wearables, setWearables] = useState<WearableData[]>([]); // Now typed as an array of WearableData
  const [loading, setLoading] = useState(false);
  const { id, timestamp } = useParams<{ id: string; timestamp: string }>(); // Also type useParams

  const { experimentId, participantId, swId, trialId } = useParams();
  const [searchParams] = useSearchParams();
  const wearableIds = searchParams.getAll('wearableIds');
  const wearableQuery = wearableIds
    .map((id) => `wearableIds=${encodeURIComponent(id)}`)
    .join('&');

  const accessToken = sessionStorage.getItem('accessToken');


 // Tengo que pasar tb lo de si es el derecho o el izquierdo, pq sino me da error por como tengo configurado lo otro.


  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    axios
      .get(
        `http://localhost:3000/swData/getData/${experimentId}/${participantId}/${swId}/${trialId}?${wearableQuery}`,
        config,
      )
      .then((response) => {
        setWearables(response.data); // Ensure the backend sends the correct format
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, timestamp]);

  return (
    <div className="p-4">
      <BackButton />
      {loading ? (
        <Spinner />
      ) : wearables.length > 0 ? (
        <div>
          <h1 className="text-3xl my-4 font-bold">Wearables Data</h1>
          <div>
            <WearablesData wearables={wearables} />{' '}
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
