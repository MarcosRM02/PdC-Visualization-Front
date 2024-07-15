import SWDataSingleCard from "./ExperimentSingleCard";
import { IExperimentProp } from "../../Types/Interfaces";

const SWDataCard = ({ experiments = [] }: IExperimentProp) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {experiments.map((item) => (
        <SWDataSingleCard key={item.id} SWDatas={item} />
      ))}
    </div>
  );
};

export default SWDataCard;
