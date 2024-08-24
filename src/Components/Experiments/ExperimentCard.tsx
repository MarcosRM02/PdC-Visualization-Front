import ExperimentSingleCard from './ExperimentSingleCard';
import { IExperimentProp } from '../../Types/Interfaces';

const ExperimentCard = ({ experiments = [] }: IExperimentProp) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {experiments.map((item) => (
        <ExperimentSingleCard key={item.id} experiments={item} />
      ))}
    </div>
  );
};

export default ExperimentCard;
