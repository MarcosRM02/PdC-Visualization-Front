import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import { WearableData } from '../../Types/Interfaces';
import WearablesData from '../../Components/WearableData/WearableData';

const ShowWearables = () => {
  const [wearables, setWearables] = useState<WearableData[]>([]); // Now typed as an array of WearableData
  const [loading, setLoading] = useState(false);
  const { id, timestamp } = useParams<{ id: string; timestamp: string }>(); // Also type useParams

  /**Toda esta parte de la consulyta, lo que voy a hacer es hacerlo en la single card, y asi lo paso todo directament aqui como una sola funcion que es su responsabilidad.
   * Paso el id de los sw, el id de el tiral, el del participante.
   * Hago una consulta para el id del experimento, buscando el experimento que contenga a ese participante
   * de ese id de sw, hago una consulta para obtener los id de los wearables.
   * Con los id de los wearables, hago una consulta para obtener los datos de los wearables.
   */

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/swdata/${id}/${timestamp}`)
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
            No Synchronized Wearables Available
          </h1>
        </div>
      )}
    </div>
  );
};

export default ShowWearables;
