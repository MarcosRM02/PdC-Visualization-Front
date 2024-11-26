// src/Components/Participants/ParticipantCard.tsx

import React from 'react';
import ParticipantSingleCard from './ParticipantSingleCard';
import { IParticipantProp, IParticipant } from '../../Types/Interfaces';

const ParticipantCard: React.FC<IParticipantProp> = ({
  participants = [],
  onParticipantDeleted,
  onParticipantEdited,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {participants.map((item) => (
        <ParticipantSingleCard
          key={item.id}
          participants={item}
          onParticipantDeleted={onParticipantDeleted} // Pasar el callback
          onParticipantEdited={onParticipantEdited} // Pasar el nuevo callback
        />
      ))}
    </div>
  );
};

export default ParticipantCard;
