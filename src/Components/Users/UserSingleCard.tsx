import { Link, useNavigate } from 'react-router-dom';
import { BiShow, BiUserCircle } from 'react-icons/bi';
import { MdEmail, MdOutlineDelete } from 'react-icons/md';
import { useState } from 'react';

import { FaIdCard } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';

const UserSingleCard = ({ professional }: { professional: any }) => {
  const navigate = useNavigate();

  if (
    !professional ||
    !professional.id ||
    !professional.name ||
    !professional.email
  ) {
    // retun null, // asi sale vacio
    return <div>No professional data available.</div>;
  }

  // LOS HAGO, PQ NO PUEDE HABER NESTED LINKS, DA ERRORES EN EL DOM
  const handleEditClick = (event) => {
    event.stopPropagation();
    navigate(`/professionals/edit/${professional.id}`);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    navigate(`/professionals/delete/${professional.id}`);
  };

  return (
    <div
      onClick={() =>
        navigate(`/experiments/by-professional/${professional.id}`)
      }
      className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl no-underline cursor-pointer"
    >
      <div className="flex justify-start items-center gap-x-2">
        <FaIdCard className="text-red-300 text-2xl" />
        <h4 className="my-2 text-gray-500">{professional.id}</h4>
      </div>
      <div className="flex justify-start items-center gap-x-2">
        <BiUserCircle className="text-red-300 text-2xl" />
        <h2 className="my-1">{professional.name}</h2>
      </div>
      <div className="flex justify-start items-center gap-x-2">
        <MdEmail className="text-red-300 text-2xl" />
        <h2 className="my-1">{professional.email}</h2>
      </div>

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

export default UserSingleCard;
