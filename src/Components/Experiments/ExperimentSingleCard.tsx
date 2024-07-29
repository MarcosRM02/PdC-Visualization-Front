import Long from 'long'; // Ensure Long is imported
import { AiOutlineEdit } from 'react-icons/ai';
import { FaIdCard } from 'react-icons/fa';
import { FaCalendarDay } from 'react-icons/fa6';
import { MdOutlineDelete } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const handleEditClick = (event) => {
    event.stopPropagation();
    navigate(`/experiments/edit/${SWDatas.id}`);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    navigate(`/experiments/delete/${SWDatas.id}`);
  };

  return (
    <div
      onClick={() => navigate(`/participants/by-experiment/${SWDatas.id}`)}
      className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl no-underline cursor-pointer"
    >
      <div key={SWDatas.id} className="my-2">
        <span className="text-gray-600"></span>
        <div className="flex justify-start items-center gap-x-2">
          <FaIdCard className="text-red-300 text-2xl" />
          <h4 className="my-2 text-gray-500"> ID: {SWDatas.id}</h4>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <FaIdCard className="text-red-300 text-2xl" />
          <h4 className="my-2 text-gray-500"> name: {SWDatas.name}</h4>
        </div>
        {/* <div className="flex justify-start items-center gap-x-2">
              <FaIdCard className="text-red-300 text-2xl" />
              <h4 className="my-2 text-gray-500">
                {" "}
                Professional Id: {SWDatas.professionalId.id}
              </h4>
            </div>  uN PRO DEBE TENER VARTIOS DE ESTOS */}
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
            Start date: {SWDatas.startDate}
          </h4>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <FaIdCard className="text-red-300 text-2xl" />
          <h4 className="my-2 text-gray-500">
            {' '}
            Finish Date: {SWDatas.finishDate}
          </h4>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <FaIdCard className="text-red-300 text-2xl" />
          <h4 className="my-2 text-gray-500"> Notes: {SWDatas.notes}</h4>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <FaIdCard className="text-red-300 text-2xl" />
          <h4 className="my-2 text-gray-500">
            {' '}
            Num of Participants: {SWDatas.numberOfParticipants}
          </h4>
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
  );
};

export default SWDataSingleCard;
