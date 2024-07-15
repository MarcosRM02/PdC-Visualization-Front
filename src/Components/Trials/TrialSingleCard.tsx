import Long from 'long'; // Ensure Long is imported
import { FaIdCard } from 'react-icons/fa';
import { FaCalendarDay } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

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

  return (
    // <Link
    //   to={`/swdata/${SWDatas.syncronized_wearables_id}/${timestampLong}`}
    //   className="no-underline"
    // >
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
          <h4 className="my-2 text-gray-500"> swId: {SWDatas.sw.id}</h4>
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
    </div>
    // </Link>
  );
};

export default SWDataSingleCard;
