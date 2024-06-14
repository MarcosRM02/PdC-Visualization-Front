import mongoose from "mongoose";
import mongooseLong from "mongoose-long";

export interface Book {
  _id: string;
  title: string;
  author: string;
  publishYear: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersCardProps {
  users: User[];
}

export interface SynchronizedWearablesCardProps {
  SynchronizedWearables: SynchronizedWearables[];
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
  wearables: string;
  //timestamp: mongoose.Types.Long;
  description: string;
  _id: string;
}
export interface WearableDataDto {
  type: string;
  data: Buffer;
}
