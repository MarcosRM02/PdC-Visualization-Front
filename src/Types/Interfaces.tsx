import Long from "long";

export interface UsersCardProps {
  users: User[];
}

export interface SynchronizedWearablesCardProps {
  SynchronizedWearables: SynchronizedWearables[];
}

export interface SWDataCardProps {
  SWDatas: SWData[];
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  synchronized_wearables: SynchronizedWearables[];
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
