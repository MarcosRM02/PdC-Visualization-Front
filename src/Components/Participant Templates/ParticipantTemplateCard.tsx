import React from 'react';
import ParticipantTemplateSingleCard from './ParticipantTemplateSingleCard';

interface IParticipant {
  id: number;
  code: string;
  personaldataid: number;
}

export interface IParticipantProp {
  participants: IParticipant[];
  onParticipantDeleted: () => void;
  onParticipantEdited: () => void; // Añadir esta línea
}

const ParticipantTemplateCard: React.FC<IParticipantProp> = ({
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
          onParticipantDeleted={onParticipantDeleted} // Pasar el callback
          onParticipantEdited={onParticipantEdited} // Pasar el nuevo callback
        />
      ))}
    </div>
  );
};

export default ParticipantTemplateCard;
