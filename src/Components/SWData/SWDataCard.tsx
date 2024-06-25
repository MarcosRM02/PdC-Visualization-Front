import SWDataSingleCard from "./SWDataSingleCard";
import { SWDataCardProps } from "../../Types/Interfaces";

const SWDataCard = ({ SWDatas = [] }: SWDataCardProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SWDatas.map((item) => (
        <SWDataSingleCard key={item._id} SWDatas={item} />
      ))}
    </div>
  );
};

export default SWDataCard;
