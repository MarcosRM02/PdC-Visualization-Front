// src/Components/Trials/TrialCard.tsx

import React from 'react';
import TemplateSingleCard from './TemplateSingleCard';

interface TrialCardProps extends ITemplateProp {
  onTrialEdited: () => void;
  onTrialDeleted: () => void; // Nuevo callback para eliminación
}

export interface ITemplate {
  id: number;
  name: string;
  description?: string;
}
export interface ITemplateProp {
  trials: ITemplate[];
}

const TrialCard: React.FC<TrialCardProps> = ({
  trials = [],
  onTrialEdited,
  onTrialDeleted, // Recibir el nuevo callback
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {trials.map((item) => (
        <TemplateSingleCard
          key={item.id}
          template={item}
          onTrialEdited={onTrialEdited}
          onTrialDeleted={onTrialDeleted} // Pasar el nuevo callback
        />
      ))}
    </div>
  );
};

export default React.memo(TrialCard);
