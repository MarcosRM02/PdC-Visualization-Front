// src/Components/Trials/TrialCard.tsx

import React from 'react';
import TrialSingleCard from './TrialTemplateSingleCard';
import { ITrialProp } from '../../Types/Interfaces';

interface TrialCardProps extends ITrialProp {
  onTrialEdited: () => void;
  onTrialDeleted: () => void; // Nuevo callback para eliminación
}

const TrialCard: React.FC<TrialCardProps> = ({
  trials = [],
  onTrialEdited,
  onTrialDeleted, // Recibir el nuevo callback
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {trials.map((item) => (
        <TrialSingleCard
          key={item.id}
          trials={item}
          onTrialEdited={onTrialEdited}
          onTrialDeleted={onTrialDeleted} // Pasar el nuevo callback
        />
      ))}
    </div>
  );
};

export default React.memo(TrialCard);
