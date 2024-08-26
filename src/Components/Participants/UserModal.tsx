import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

// Tenggo que pasarle el id, y que haga la petcion de los datos personales (GET)
const UserModal = ({ user, onClose }: { user: any; onClose: any }) => {
  const navigate = useNavigate();

  if (!user) {
    // retun null, // asi sale vacio
    return <div>No personal data available.</div>;
  }

  // LOS HAGO, PQ NO PUEDE HABER NESTED LINKS, DA ERRORES EN EL DOM
  const handleEditClick = (event: any) => {
    event.stopPropagation();
    navigate(`/personalData/edit/${user.id}`);
  };

  // const handleDeleteClick = (event) => {
  //   event.stopPropagation();
  //   navigate(`/personalData/delete/${user.id}`);
  // };

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] max-w-full h-[400px] bg-white rounded-xl p-4 flex flex-col relative"
      >
        <AiOutlineClose
          className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}
        />
        <h4 className="my-2 text-gray-500">Participant Personal Data</h4>
        <h2 className="my-1">Name: {user.name}</h2>
        <div className="flex justify-start items-center gap-x-2">
          <PiBookOpenTextLight className="text-red-300 text-2xl" />
          <h2 className="my-1">Age: {user.age}</h2>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1">Height: {user.height} cm</h2>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1">Weight: {user.weight} kg</h2>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1">Foot Length: {user.footLength} cm</h2>
        </div>
        <div className="flex justify-between items-center gap-x-2 mt-4 p-4">
          <button
            onClick={handleEditClick}
            className="bg-transparent border-none cursor-pointer"
          >
            <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-black" />
          </button>

          {/* <button
            onClick={handleDeleteClick}
            className="bg-transparent border-none cursor-pointer"
          >
            <MdOutlineDelete className="text-2xl text-red-600 hover:text-black" />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
