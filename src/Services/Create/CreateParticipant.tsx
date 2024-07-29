import { useState } from 'react';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { data } from 'autoprefixer';

const CreateBooks = () => {
  const [height, setHeight] = useState('');
  const [weight, setweight] = useState('');
  const [footLength, setfootLength] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const accessToken = sessionStorage.getItem('accessToken');

  console.log(accessToken);

  const handleSequentialPost = () => {
    const dataToSend = {
      ...(name && { name }),
      ...(age && { age: Number(age) }),
      ...(height && { height: Number(height) }),
      ...(weight && { weight: Number(weight) }),
      ...(footLength && { footLength: Number(footLength) }),
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    // First POST request
    axios
      .post(`http://172.18.0.4:3000/personalData`, dataToSend, config)
      .then((response1) => {
        // Assume response1.data contains the ID needed for the next request
        const newId = response1.data;
        console.log('newId', newId);
        // Data for the second PUT request, using the ID from the first response
        const data = {
          code,
          personalDataId: newId, // This is the ID obtained from the first request
        };

        // Second POST request
        axios
          .post(
            `http://172.18.0.6:3000/participants/create/${id}`,
            data,
            config,
          )
          .then(() => {
            setLoading(false);
            enqueueSnackbar('Participant Created successfully', {
              variant: 'success',
            });
            navigate(-1);
          })
          .catch((error2) => {
            // Handle error for the second update
            setLoading(false);
            enqueueSnackbar('Error creating the second resource', {
              variant: 'error',
            });
            console.log('Failed to cr4eate the second resource', error2);
          });
      })
      .catch((error1) => {
        // Handle error for the first update
        setLoading(false);
        enqueueSnackbar('Error creating the first resource', {
          variant: 'error',
        });
        console.log('Failed to create the first resource', error1);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Create Participant</h1>
      {loading ? <Spinner /> : ''}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
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
          <label className="text-xl mr-4 text-gray-500">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Age (optional)</label>
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Height (optional){' '}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Weight (optional)
          </label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setweight(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Foot Length (optional)
          </label>
          <input
            type="number"
            value={footLength}
            onChange={(e) => setfootLength(e.target.value)}
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

export default CreateBooks;
