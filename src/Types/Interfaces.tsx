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
  WearablesId: string;
  wearable_type: string;
  dataframe: DataFrameRow;
}

export interface WearableDataProps {
  wearables: WearableData[];
}

export interface IExperimentProp {
  experiments: IExperiment[];
}

export interface IExperiment {
  id: number;
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  notes?: string; // Optional Attribute
  numberOfParticipants: number;
  // professionalId: User; // UN EXPERIMENTO TIENE QUE TENER VARIOS, ESTO HAY QUE CAMBIARLO
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

export interface IProfessonal {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface IProfessonalProps {
  professionals: IProfessonal[];
}
