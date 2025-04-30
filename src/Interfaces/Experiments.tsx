export interface IExperiment {
  id: number;
  name: string;
  description: string;
  numberOfParticipants: number;
  startDate: string;
  finishDate?: string;
  notes?: string;
}
export interface IExperimentCardProps {
  experiments: IExperiment[];
  onExperimentDeleted: () => void;
  onExperimentEdited: () => void;
}

export interface IExperimentSingleCardProps {
  experiment: IExperiment;
  onExperimentDeleted: () => void;
  onExperimentEdited: () => void;
}
