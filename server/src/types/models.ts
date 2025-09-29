import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password:string;
  phone?: string;
  isActive: boolean;
  avatarUrl?: string;
  status?: string;
  lastSeen?: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}