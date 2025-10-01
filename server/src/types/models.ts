import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  avatarUrl?: string;
  otp?: string;
  status?: string;
  lastSeen?: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  sessions: {
    forgetPassword: string;
    loginUser: string;
  };
}