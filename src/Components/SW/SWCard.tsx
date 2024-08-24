import SWDataSingleCard from './SWSingleCard';
import { SynchronizedWearablesCardProps } from '../../Types/Interfaces';

const SWCard = ({
  SynchronizedWearables = [],
}: SynchronizedWearablesCardProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SynchronizedWearables.map((item) => (
        <SWDataSingleCard key={item._id} SynchronizedWearables={item} />
      ))}
    </div>
  );
};

export default SWCard;
