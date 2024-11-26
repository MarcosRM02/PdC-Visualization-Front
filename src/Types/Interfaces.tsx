import Long from 'long';

export interface SynchronizedWearablesCardProps {
  SynchronizedWearables: SynchronizedWearables[];
}

export interface SWDataCardProps {
  SWDatas: SWData[];
}

export interface SynchronizedWearables {
  // Cambiar el nombre de la interfaz
  _id: string;
  wearables: string;
  description: string;
}

export interface SWData {
  _id: string;
  syncronized_wearables_id: string;
  timestamp: typeof Long;
  wearableData: string[];
}
// export interface WearableData {
//   WereableId: string;
//   wearable_type: string;
//   dataframe: JSON; // Acordarse de que esto en realidad es un danfo dataframe, que hay que desjasonizar
// }

interface DataFrameRow {
  [key: string]: number[]; // Assuming the arrays are of numbers
}

export interface WearableData {
  wearablesId: string;
  wearableType: string;
  dataframe: DataFrameRow;
  frequency: number;
}

export interface WearableDataProps {
  wearables: WearableData[];
  trialId: number;
  experimentId: number;
  participantId: number;
  swId: number;
}

// src/Types/Interfaces.ts

export interface IExperiment {
  id: number;
  name: string;
  description: string;
  numberOfParticipants: number;
  startDate: string;
  finishDate?: string;
  notes?: string;
}

export interface IExperimentProp {
  experiments: IExperiment[];
  onExperimentDeleted: () => void;
  onExperimentEdited: () => void; // Añadir esta línea
}

export interface IParticipantProp {
  participants: IParticipant[];
}

export interface IParticipant {
  id: number;
  code: string;
}

export interface ITrialProp {
  trials: ITrial[];
}

export interface ITrial {
  id: number;
  date: string;
  code?: string;
  description?: string;
  annotation?: string;
  participantId: IParticipant;
  swId: ISWData;
}

export interface ISWData {
  id: number;
}

export interface IProfessional {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface IProfessionalProps {
  professionals: IProfessional[];
}
