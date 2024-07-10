import { Link } from "react-router-dom";
import { BiUserCircle } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { useState } from "react";
import UserModal from "./UserModal";
import { FaIdCard } from "react-icons/fa";

const UserSingleCard = ({ user }: { user: any }) => {
  const [showModal, setShowModal] = useState(false);
  if (!user || !user._id || !user.name || !user.email) {
    return <div>No user data available.</div>; // Mostrar un mensaje o retornar null
  }
  return (
    <Link to={`/users/${user.email}`} className="no-underline">
      <div className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl">
        <div className="flex justify-start items-center gap-x-2">
          <FaIdCard className="text-red-300 text-2xl" />
          <h4 className="my-2 text-gray-500">{user._id}</h4>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1">{user.name}</h2>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <MdEmail className="text-red-300 text-2xl" />
          <h2 className="my-1">{user.email}</h2>
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
        {showModal && (
          <UserModal user={user} onClose={() => setShowModal(false)} />
        )}
      </div>
    </Link>
  );
};

export default UserSingleCard;
