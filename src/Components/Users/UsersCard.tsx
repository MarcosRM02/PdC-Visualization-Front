import UserSingleCard from "./UserSingleCard";
import { UsersCardProps } from "../../Types/Interfaces";

const UserCard = ({ users = [] }: UsersCardProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map((item) => (
        <UserSingleCard key={item._id} user={item} />
      ))}
    </div>
  );
};

export default UserCard;
