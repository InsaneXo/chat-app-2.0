import mongoose, { Schema } from "mongoose";
import { IFriendRequest } from "../types/models";

const FriendRequestSchema: Schema<IFriendRequest> = new Schema({
    sender: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: [true, "Sender is required"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: [true, "Receiver is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true })

export default mongoose.model<IFriendRequest>("FriendRequestModel", FriendRequestSchema)