import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../Components/BackButton";
import Spinner from "../Components/Spinner";
import { User } from "../Types/Interfaces";

const ShowUser = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/users/${id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]); // Añadir id como dependencia para reaccionar a los cambios de id

  return (
    <div className="p-4">
  <BackButton />
  {loading ? (
    <Spinner />
  ) : user ? (
    <div>
      <h1 className="text-3xl my-4">
        <span>{user.name}</span> {/* No necesitas usar `user?.name` aquí porque ya estás dentro de la verificación de `user` */}
      </h1>
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
        <div className="my-4">
          <span className="text-xl mr-4 text-gray-500">Name</span>
          <span>{user.name}</span>
        </div>
        <div className="my-4">
          <span className="text-xl mr-4 text-gray-500">Username</span>
          <span>{user.username}</span>
        </div>
        <div className="my-4">
          <span className="text-xl mr-4 text-gray-500">Email</span>
          <span>{user.email}</span>
        </div>
        {user.synchronized_wearables && user.synchronized_wearables.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold my-2">Synchronized Wearables</h3>
            {user.synchronized_wearables.map((wearable) => (
              <div key={wearable._id} className="my-2">
                <span className="text-gray-600">ID: {wearable._id}</span>
                <br />
                <span className="text-gray-600">
                  Description: {wearable.description}
                </span>
                <br />
                <span className="text-gray-600">
                  Wearable ID: {wearable.wearables}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No synchronized wearables available.</p>
        )}
      </div>
    </div>
  ) : (
    <div>No User data available.</div>
  )}
</div>

  );
};

export default ShowUser;
