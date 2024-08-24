import ParticipantSingleCard from './ParticipantSingleCard';
import { IParticipantProp } from '../../Types/Interfaces';

const ParticipantCard = ({ participants = [] }: IParticipantProp) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {participants.map((item) => (
        <ParticipantSingleCard key={item.id} participants={item} />
      ))}
    </div>
  );
};

export default ParticipantCard;
