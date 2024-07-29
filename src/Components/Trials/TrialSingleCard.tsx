import Long from 'long'; // Ensure Long is imported
import { AiOutlineEdit } from 'react-icons/ai';
import { FaIdCard } from 'react-icons/fa';
import { FaCalendarDay } from 'react-icons/fa6';
import { MdOutlineDelete } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { getIDFromAPI } from '../../Services/Read/CreateWearablesURL';
import { useEffect, useState } from 'react';

const SWDataSingleCard = ({ SWDatas }: { SWDatas: any }) => {
  // const timestampLong = new Long(
  //   SWDatas.timestamp.low,
  //   SWDatas.timestamp.high,
  //   SWDatas.timestamp.unsigned
  // );

  // console.log("timestampLong", timestampLong);

  // const readableTimestamp = timestampLong.toString(); // El timestamp en formato string
  // console.log("readableTimestamp", readableTimestamp);

  // const timestampNumber = timestampLong.toNumber();

  // // Create a Date object
  // const date = new Date(timestampNumber);

  // const dateString =
  //   date.toLocaleDateString("en-US", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   }) +
  //   " " +
  //   date.toLocaleTimeString("en-US");



  const [data, setData] = useState({
    experimentId: null,
    wearablesIds: [],
  });
  const [error, setError] = useState('');
  const participantId = SWDatas.participant.id;
  const swId = SWDatas.sw.id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getIDFromAPI(participantId, swId);
        setData({
          experimentId: result.experimentId,
          wearablesIds: result.wearablesIds,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, [participantId, swId]);

  const navigate = useNavigate();
  const handleEditClick = (event) => {
    event.stopPropagation();
    navigate(`/trials/edit/${SWDatas.id}`);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    navigate(`/trials/delete/${SWDatas.id}`);
  };
  // Construcción de la URL para el Link
  const detailsBasePath = `/swData/getData/${data.experimentId}/${participantId}/${swId}/${SWDatas.id}`;
  const wearableQuery = data.wearablesIds
    .map((id) => `wearableIds=${id}`)
    .join('&');
  const detailsUrl = `${detailsBasePath}?${wearableQuery}`;
  return (
    <Link to={detailsUrl} className="no-underline">
      <div className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl">
        <div key={SWDatas.id} className="my-2">
          <span className="text-gray-600"></span>
          <div className="flex justify-start items-center gap-x-2">
            <FaIdCard className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500"> ID: {SWDatas.id}</h4>
          </div>
          <div className="flex justify-start items-center gap-x-2">
            <FaIdCard className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500"> date: {SWDatas.date}</h4>
          </div>
          <div className="flex justify-start items-center gap-x-2">
            <FaIdCard className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500"> code: {SWDatas.code}</h4>
          </div>
          <div className="flex justify-start items-center gap-x-2">
            <FaIdCard className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500">
              {' '}
              description: {SWDatas.description}
            </h4>
          </div>
          <div className="flex justify-start items-center gap-x-2">
            <FaIdCard className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500">
              {' '}
              Annotation: {SWDatas.annotation}
            </h4>
          </div>
          <div className="flex justify-start items-center gap-x-2">
            <FaIdCard className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500"> swId: {SWDatas.sw.id}</h4>
          </div>
          <div>
            <h1>Experiment and Wearables IDs</h1>
            {error ? (
              <p>Error: {error}</p>
            ) : (
              <div>
                <p>Experiment ID: {data.experimentId}</p>
                <p>Wearables IDs: {data.wearablesIds.join(', ')}</p>
              </div>
            )}
          </div>
          {/* <div className="flex justify-start items-center gap-x-2">
          <FaIdCard className="text-red-300 text-2xl" />
          <h4 className="my-2 text-gray-500">
            {" "}
            ID: {SWDatas.syncronized_wearables_id}
          </h4>
        </div>  No es necesario, pq ya esta en la pagina anterior, queda redundante.*/}
          {/* 
          <div className="flex justify-start items-center gap-x-2">
            <FaCalendarDay className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500"> Date: {dateString}</h4>
          </div> */}
          {/* <div className="flex justify-start items-center gap-x-2 flex-wrap">
            {SWDatas.wearableData.map((item: any, index: any) => (
              <div key={index} className="flex items-center gap-x-2">
                <FaIdCard className="text-red-300 text-2xl" />
                <h4 className="my-2 text-gray-500">Wearable Id: {item}</h4>
                <br />
              </div>
            ))}
          </div> */}
          PONER LOS WEARABLES QUE CONTIENE CADA SW COMO UN MODAL
        </div>
        {/*
        <div className="flex justify-between items-center gap-x-2 mt-4 p-4">
          <BiShow
            className="text-3xl text-blue-800 hover:text-black cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        <Link to={`/books/details/${User._id}`}>
          <BsInfoCircle className="text-2xl text-green-800 hover:text-black" />
        </Link>
        <Link to={`/books/edit/${User._id}`}>
          <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-black" />
        </Link>
        <Link to={`/books/delete/${User._id}`}>
          <MdOutlineDelete className="text-2xl text-red-600 hover:text-black" />
        </Link>
      </div> */}
        <div className="flex justify-between items-center gap-x-2 mt-4 p-4">
          <button
            onClick={handleEditClick}
            className="bg-transparent border-none cursor-pointer"
          >
            <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-black" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-transparent border-none cursor-pointer"
          >
            <MdOutlineDelete className="text-2xl text-red-600 hover:text-black" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default SWDataSingleCard;
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

function setData(arg0: { experimentId: any; wearablesIds: any }) {
  throw new Error('Function not implemented.');
}
