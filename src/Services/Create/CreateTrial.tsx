import { useEffect, useState } from 'react';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateTrial = () => {
  const [description, setDescription] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [code, setCode] = useState('');
  const [date, setDate] = useState('');
  const [swId, setSWId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const [swIds, setSWIds] = useState([]);

  useEffect(() => {
    // Hacer la llamada a la API para obtener los SW Ids cuando el componente se monta
    const fetchSWIds = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sw`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSWIds(response.data); // Suponiendo que la API devuelve un array de SW Ids
      } catch (error) {
        console.error('Error fetching SW Ids:', error);
      }
    };

    fetchSWIds();
  }, [apiUrl, accessToken]);

  const handleSequentialPost = () => {
    const dataToSend = {
      date: new Date(date),
      swId: Number(swId),
      participantId: Number(id),
      ...(description && { description: String(description) }),
      ...(code && { weight: String(code) }),
      ...(annotation && { annotation: String(annotation) }),
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    // First POST request
    axios
      .post(`${apiUrl}/trials/create`, dataToSend, config)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Experiment Created successfully', {
          variant: 'success',
        });
        navigate(-1);
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Chack console');
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Create Trial</h1>
      {loading ? <Spinner /> : ''}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">SW Id</label>
          <select
            value={swId}
            onChange={(e) => setSWId(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          >
            <option value="">Select SW Id</option>
            {swIds.map((sw) => (
              // @ts-ignore
              <option key={sw.id} value={sw.id}>
                {/* @ts-ignore */}
                {sw.id}{' '}
                {/* O el campo que quieras mostrar como texto en el dropdown */}
              </option>
            ))}
          </select>
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Code (optional)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Annotations (optional){' '}
          </label>
          <input
            type="text"
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>

        <button className="p-2 bg-sky-300 m-8" onClick={handleSequentialPost}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateTrial;
