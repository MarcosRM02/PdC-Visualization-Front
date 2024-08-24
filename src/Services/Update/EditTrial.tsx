import { useState, useEffect } from 'react';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditTrial = () => {
  const [code, setCode] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [annotation, setAnnotation] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    axios
      .get(`${apiUrl}/trials/${id}`, config)
      .then((response) => {
        const { code, date, description, annotation } = response.data; // Asegúrate de que la respuesta tenga estas propiedades
        setCode(code);
        setDate(date); // Establece el valor de date en el estado
        setDescription(description); // Establece el valor de description en el estado
        setAnnotation(annotation); // Establece el valor de annotation en el estado
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please Check console');
        console.log(error);
      });
  }, [apiUrl, id, accessToken]);

  const handleEditExperiment = () => {
    const data = {
      code,
      date, // Asegúrate de enviar la fecha actualizada
      description, // Asegúrate de enviar la descripción actualizada
      annotation, // Asegúrate de enviar la anotación actualizada
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    axios
      .put(`${apiUrl}/trials/edit/${id}`, data, config)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Trial Edited successfully', {
          variant: 'success',
        });
        navigate(-1);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Edit Trial</h1>
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
          <label className="text-xl mr-4 text-gray-500">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Annotation</label>
          <input
            type="text"
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <button className="p-2 bg-sky-300 m-8" onClick={handleEditExperiment}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditTrial;
