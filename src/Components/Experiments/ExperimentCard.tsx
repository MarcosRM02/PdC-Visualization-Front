// src/Components/Experiments/ExperimentCard.tsx

import React from 'react';
import ExperimentSingleCard from './ExperimentSingleCard';
import { IExperimentProp, IExperiment } from '../../Types/Interfaces';

const ExperimentCard: React.FC<IExperimentProp> = ({
  experiments = [],
  onExperimentDeleted,
  onExperimentEdited, // Añadir esta línea
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {experiments.map((item) => (
        <ExperimentSingleCard
          key={item.id}
          experiments={item}
          onExperimentDeleted={onExperimentDeleted} // Pasar el callback
          onExperimentEdited={onExperimentEdited} // Pasar el nuevo callback
        />
      ))}
    </div>
  );
};

export default ExperimentCard;
