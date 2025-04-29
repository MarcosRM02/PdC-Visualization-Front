import React from 'react';
import TrialSingleCard from './TrialSingleCard';
import { ITrialCardProps } from '../../Interfaces/Trials';

const TrialCard: React.FC<ITrialCardProps> = ({
  trials = [],
  onTrialEdited,
  onTrialDeleted,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {trials.map((item) => (
        <TrialSingleCard
          key={item.id}
          trials={item}
          onTrialEdited={onTrialEdited}
          onTrialDeleted={onTrialDeleted}
        />
      ))}
    </div>
  );
};

export default React.memo(TrialCard);
