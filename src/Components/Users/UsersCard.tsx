import UserSingleCard from './UserSingleCard';
import { IProfessionalProps } from '../../Types/Interfaces';

const UserCard = ({ professionals = [] }: IProfessionalProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {professionals.map((item) => (
        <UserSingleCard key={item.id} professional={item} />
      ))}
    </div>
  );
};

export default UserCard;
