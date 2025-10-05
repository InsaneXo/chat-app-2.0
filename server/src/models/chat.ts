import mongoose, { Schema } from "mongoose";
import { IChat } from "../types/models";

const ChatSchema: Schema<IChat> = new Schema(
    {
    name: { type: String, trim: true },
    isGroup: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "MessageModel",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  { timestamps: true }
)

export default mongoose.model<IChat>("ChatModel", ChatSchema);