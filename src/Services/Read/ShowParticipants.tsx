import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import SWDataCard from '../../Components/Participants/ParticipantCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Long from 'long';
import { MdOutlineAddBox } from 'react-icons/md';

const ShowSWData = () => {
  const [sWDatas, setSWDatas] = useState([]);
  const [filteredSWDatas, setFilteredSWDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    setLoading(true);
    axios
      .get(`http://localhost:3000/participants/by-experiment/${id}`, config)
      .then((response) => {
        setSWDatas(response.data);
        setFilteredSWDatas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4 font-bold">
        <span> Participants</span>{' '}
      </h1>
      <div className="flex justify-between items-center">
        <Link to={`/participants/create/${id}`}>
          <MdOutlineAddBox className="text-sky-800 text-4xl" />
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : sWDatas.length > 0 ? (
        <div>
          <div>
            <SWDataCard participants={filteredSWDatas} />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl my-4 font-bold">
            <span> No Participants Available</span>{' '}
          </h1>
        </div>
      )}
    </div>
  );
};

export default ShowSWData;
