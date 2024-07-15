import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Spinner from '../../Components/Spinner';
import SWDataCard from '../../Components/Experiments/ExperimentCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Long from 'long';
import { MdOutlineAddBox } from 'react-icons/md';

const ShowSWData = () => {
  const [sWDatas, setSWDatas] = useState([]);
  const [filteredSWDatas, setFilteredSWDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/experiments/by-professional/${id}`)
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

  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());

  // const handleFilter = () => {
  //   const filtered = sWDatas.filter((data) => {
  //     const timestampLong = new Long(
  //       data.timestamp.low,
  //       data.timestamp.high,
  //       data.timestamp.unsigned
  //     );
  //     const timestampNumber = timestampLong.toNumber();
  //     const dataDate = new Date(timestampNumber);

  //     return dataDate >= startDate && dataDate <= endDate;
  //   });
  //   setFilteredSWDatas(filtered);
  // };

  // const clearFilters = () => {
  //   const now = new Date();
  //   setStartDate(now); // Restablecer a la fecha actual o ajustar según la necesidad
  //   setEndDate(now); // Restablecer a la fecha actual o ajustar según la necesidad
  //   setFilteredSWDatas(sWDatas); // Mostrar todos los datos nuevamente
  // };

  return (
    <div className="p-4">
      <BackButton />
      {loading ? (
        <Spinner />
      ) : sWDatas.length > 0 ? (
        <div>
          <h1 className="text-3xl my-4 font-bold">
            <span> Experiments</span>{' '}
          </h1>
          {/* <div className="flex justify-center my-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="mx-2"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="mx-2"
            />
          </div> */}
          {/* <div className="flex justify-center space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleFilter}
            >
              Filter Data
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div> */}
          <div className="flex justify-between items-center">
            <Link to="/experiments/create">
              <MdOutlineAddBox className="text-sky-800 text-4xl" />
            </Link>
          </div>

          <div>
            <SWDataCard experiments={filteredSWDatas} />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl my-4 font-bold">
            <span> No Experiments Available</span>{' '}
          </h1>
        </div>
      )}
    </div>
  );
};

export default ShowSWData;
