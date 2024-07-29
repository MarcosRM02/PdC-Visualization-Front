import Long from 'long'; // Ensure Long is imported
import { AiOutlineEdit } from 'react-icons/ai';
import { FaIdCard } from 'react-icons/fa';
import { FaCalendarDay } from 'react-icons/fa6';
import { MdOutlineDelete } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import UserModal from './UserModal';
import { BiShow } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SWDataSingleCard = ({ SWDatas }: { SWDatas: any }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
  }, [showModal]);

  const handleEditClick = (event) => {
    event.stopPropagation();
    navigate(`/participants/edit/${SWDatas.id}`);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    navigate(`/participants/delete/${SWDatas.id}`);
  };


  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (showModal && SWDatas.personalData.id) {

      setLoading(true);
      axios
        .get(`http://localhost:3000/personalData/${SWDatas.personalData.id}`)
        .then((response) => {
          setModalData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch data:', err);
          setError('Failed to load data');
          setLoading(false);
        });
    }
  }, [showModal, SWDatas.personalData.id]);


  return (
    <div
      onClick={() => navigate(`/trials/by-participant/${SWDatas.id}`)}
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
          <h4 className="my-2 text-gray-500"> code: {SWDatas.code}</h4>
        </div>
      </div>
      <div className="flex justify-between items-center gap-x-2 mt-4 p-4">
        <div
          onClick={() =>
            navigate(`/trials/by-participant/${SWDatas.personalData.id}`)
          }
          className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl no-underline cursor-pointer"
        >
          {/* Card Content */}
          <BiShow
            className="text-3xl text-blue-800 hover:text-black cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          />
          {showModal && (
            <UserModal user={modalData} onClose={() => setShowModal(false)} />
          )}
        </div>
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
      {/* {showModal && (
        <UserModal user={modalData} onClose={() => setShowModal(false)} />
      )} */}
    </div>
  );
};

export default SWDataSingleCard;
