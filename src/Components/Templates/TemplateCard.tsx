import React from 'react';
import TemplateSingleCard from './TemplateSingleCard';
import { ITrialTemplateCardProps } from '../../Interfaces/Trials';

const TrialCard: React.FC<ITrialTemplateCardProps> = ({
  trials = [],
  onTrialEdited,
  onTrialDeleted,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {trials.map((item) => (
        <TemplateSingleCard
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
