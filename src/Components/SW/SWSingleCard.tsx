import { Link } from "react-router-dom";
import { MdDescription } from "react-icons/md";
import { FaIdCard } from "react-icons/fa";

const SWDataSingleCard = ({
  SynchronizedWearables,
}: {
  SynchronizedWearables: any;
}) => {
  if (
    !SynchronizedWearables ||
    !SynchronizedWearables._id ||
    !SynchronizedWearables.wearables ||
    !SynchronizedWearables.description
  ) {
    return <div>No user data available.</div>; // Mostrar un mensaje o retornar null
  }
  return (
    <Link
      to={`/swdata/${SynchronizedWearables.wearables}`}
      className="no-underline"
    >
      <div className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl">
        <div key={SynchronizedWearables._id} className="my-2">
          <span className="text-gray-600"></span>

          <div className="flex justify-start items-center gap-x-2">
            <FaIdCard className="text-red-300 text-2xl" />
            <h4 className="my-2 text-gray-500">
              {" "}
              ID: {SynchronizedWearables.wearables}
            </h4>
          </div>

          <div className="flex justify-start items-center gap-x-2">
            <MdDescription className="text-red-300 text-2xl" />
            <div>
              <h4 className="my-2 text-gray-500">
                {" "}
                {/*Probar a meter el ojo para ver la descripción*/}
                Description: {SynchronizedWearables.description}
              </h4>
            </div>
          </div>
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
    </Link>
  );
};

export default SWDataSingleCard;
