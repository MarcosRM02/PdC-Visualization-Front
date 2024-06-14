import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../Components/BackButton";
import Spinner from "../Components/Spinner";
import { User } from "../Types/Interfaces";
import SWDataCard from "../Components/SWData/SWDataCard";

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

  //console.log(user?.synchronized_wearables);
  return (
    <div className="p-4">
      <BackButton />
      {loading ? (
        <Spinner />
      ) : user ? (
        <div>
          <h1 className="text-3xl my-4 font-bold">
            <span>{user.name}`s Synchronized Wearables </span>{" "}
            {/* No necesitas usar `user?.name` aquí porque ya estás dentro de la verificación de `user` */}
          </h1>
          <div>
            {user.synchronized_wearables &&
            user.synchronized_wearables.length > 0 ? (
              <div>
                <SWDataCard
                  SynchronizedWearables={user.synchronized_wearables}
                />
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
