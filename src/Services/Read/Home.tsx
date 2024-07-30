import { useEffect, useState } from 'react';
import axios from 'axios';
import UsersCard from '../../Components/Users/UsersCard';
import { MdOutlineAddBox } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [_, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/professionals`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Users List</h1>
        <Link to="/professionals/create">
          <MdOutlineAddBox className="text-sky-800 text-4xl" />
        </Link>
      </div>

      <UsersCard professionals={users} />
    </div>
  );
};

export default Home;
