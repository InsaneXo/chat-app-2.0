import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/models";

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    isActive: { type: Boolean, default: false },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Please provide a valid phone number"],
    },
    avatarUrl: { type: String, trim: true },
    status: {
      type: String,
      default: "Hey there! I am using ConnectWave",
      maxlength: 150,
    },
    otp: { type: String },
    lastSeen: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    session: {type: String, }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("UserModel", UserSchema);
