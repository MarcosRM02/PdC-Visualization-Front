import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../Components/BackButton";
import Spinner from "../Components/Spinner";
import SWDataCard from "../Components/SWData/SWDataCard";

const ShowSWData = () => {
  const [sWDatas, setSWDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/swdata/${id}`)
      .then((response) => {
        setSWDatas(response.data);
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
      ) : sWDatas.length > 0 ? (
        <div>
          <h1 className="text-3xl my-4 font-bold">
            <span> Synchronized Wearables Data</span>{" "}
          </h1>
          <div>
            <div>
              <SWDataCard SWDatas={sWDatas} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl my-4 font-bold">
            <span> No Synchronized Wearables Available</span>{" "}
          </h1>
        </div>
      )}
    </div>
  );
};

export default ShowSWData;
