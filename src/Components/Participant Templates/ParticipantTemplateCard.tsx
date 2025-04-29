import ParticipantTemplateSingleCard from './ParticipantTemplateSingleCard';
import { IParticipantCardProp } from '../../Interfaces/Participants';

const ParticipantTemplateCard: React.FC<IParticipantCardProp> = ({
  participants = [],
  onParticipantDeleted,
  onParticipantEdited,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {participants.map((item) => (
        <ParticipantTemplateSingleCard
          key={item.id}
          participants={item}
          onParticipantDeleted={onParticipantDeleted}
          onParticipantEdited={onParticipantEdited}
        />
      ))}
    </div>
  );
};

export default ParticipantTemplateCard;
