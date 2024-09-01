import { useState } from 'react';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { NumericFormat } from 'react-number-format';

const CreateParticipant = () => {
  const [height, setHeight] = useState('');
  const [weight, setweight] = useState('');
  const [footLength, setFootLength] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  console.log(accessToken);
  const apiUrl = import.meta.env.VITE_API_URL;

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
      .post(`${apiUrl}/personalData`, dataToSend, config)
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
          .post(`${apiUrl}/participants/create/${id}`, data, config)
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
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
            min="1" // Evita números menores que 1
            step="1" // Solo permite números enteros
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Height (optional){' '}
          </label>
          <NumericFormat
            value={height}
            onValueChange={(values) => {
              const { floatValue } = values;
              //@ts-ignore
              setHeight(floatValue);
            }}
            className="border-2 border-gray-500 px-4 py-2 w-full"
            decimalScale={2}
            fixedDecimalScale={true}
            allowNegative={false}
            decimalSeparator="."
            thousandSeparator={false}
            placeholder="Enter height in meters"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Weight (optional)
          </label>
          <NumericFormat
            value={weight}
            onValueChange={(values) => {
              const { floatValue } = values;
              //@ts-ignore
              setweight(floatValue);
            }}
            className="border-2 border-gray-500 px-4 py-2 w-full"
            decimalScale={2}
            fixedDecimalScale={true}
            allowNegative={false}
            decimalSeparator="."
            thousandSeparator={false}
            placeholder="Enter weight in kg"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Foot Length (optional)
          </label>
          <NumericFormat
            value={footLength}
            onValueChange={(values) => {
              const { floatValue } = values;
              //@ts-ignore
              setFootLength(floatValue);
            }}
            className="border-2 border-gray-500 px-4 py-2 w-full"
            decimalScale={2}
            fixedDecimalScale={true}
            allowNegative={false}
            decimalSeparator="."
            thousandSeparator={false}
            placeholder="Enter footlength in cm"
          />
        </div>
        <button className="p-2 bg-sky-300 m-8" onClick={handleSequentialPost}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateParticipant;
