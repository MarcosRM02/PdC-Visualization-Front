// src/Components/Participants/ParticipantCard.tsx

import React from 'react';
import ParticipantTemplateSingleCard from './ParticipantTemplateSingleCard';
import { IParticipantProp } from '../../Types/Interfaces';

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
