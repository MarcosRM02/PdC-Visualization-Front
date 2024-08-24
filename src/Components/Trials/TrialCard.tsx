import TrialSingleCard from './TrialSingleCard';
import { ITrialProp } from '../../Types/Interfaces';

const TrialCard = ({ trials = [] }: ITrialProp) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {trials.map((item) => (
        <TrialSingleCard key={item.id} trials={item} />
      ))}
    </div>
  );
};

export default TrialCard;
