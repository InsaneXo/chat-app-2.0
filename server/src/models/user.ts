import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/models";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    isActive:{type: Boolean, default: false},
    phone: { type: String },
    avatarUrl: { type: String },
    status: { type: String, default: "Hey there! I am using ConnectWave" },
    lastSeen: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("UserModel", UserSchema);
