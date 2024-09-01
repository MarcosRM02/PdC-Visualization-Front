import { useState, useEffect } from 'react';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { NumericFormat } from 'react-number-format';

const EditPersonalData = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [height, setHeight] = useState('');
  const [weight, setweight] = useState('');
  const [footLength, setfootLength] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
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
      .get(`${apiUrl}/personalData/${id}`, config)
      .then((response) => {
        setName(response.data.name);
        setAge(response.data.age);
        setHeight(response.data.height);
        setweight(response.data.weight);
        setfootLength(response.data.footLength);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  }, []);

  const handleEditPersonalData = () => {
    const data = {
      name,
      age,
      height,
      weight,
      footLength,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log(data);
    setLoading(true);
    axios
      .put(`${apiUrl}/personalData/edit/${id}`, data, config)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Personal Data Edited successfully', {
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
      <h1 className="text-3xl my-4">Create Participant</h1>
      {loading ? <Spinner /> : ''}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
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
        <button className="p-2 bg-sky-300 m-8" onClick={handleEditPersonalData}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPersonalData;
