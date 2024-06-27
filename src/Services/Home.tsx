import { useEffect, useState } from "react";
import axios from "axios";
import UsersCard from "../Components/Users/UsersCard";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [_, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/users")
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
        {/* <Link to="/books/create">
          <MdOutlineAddBox className="text-sky-800 text-4xl" />
        </Link> */}
      </div>

      <UsersCard users={users} />
    </div>
  );
};

export default Home;
