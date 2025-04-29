import React from 'react';
import ExperimentSingleCard from './ExperimentSingleCard';
import { IExperimentCardProps } from '../../Interfaces/Experiments';

const ExperimentCard: React.FC<IExperimentCardProps> = ({
  experiments,
  onExperimentDeleted,
  onExperimentEdited,
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {experiments.map((experiment) => (
        <ExperimentSingleCard
          key={experiment.id}
          experiment={experiment}
          onExperimentDeleted={onExperimentDeleted}
          onExperimentEdited={onExperimentEdited}
        />
      ))}
    </div>
  );
};

export default React.memo(ExperimentCard);
