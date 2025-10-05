import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id:string;
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

export interface IChat extends Document{
  name?: string;
  isGroup: boolean;
  participants: Types.ObjectId[] | IUser[];
  latestMessage?: Types.ObjectId | IMessage;
  groupAdmin?: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document{
  sender: Types.ObjectId | IUser;
  chatId: Types.ObjectId | IChat;
  content: string;
  messageType: "text" | "image" | "file" | "video" | "audio";
  seenBy: (Types.ObjectId | IUser)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFriendRequest extends Document {
  sender: Types.ObjectId | IUser;     
  receiver: Types.ObjectId | IUser;   
  status: "pending" | "accepted" | "rejected"; 
  createdAt: Date;
  updatedAt: Date;
}