import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types/models";

const MessageSchema: Schema<IMessage> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "ChatModel",
        required: true,
    },
    content: {
        type: String,
        required: [true, "Message content is required"],
        trim: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file", "video", "audio"],
        default: "text",
    },
    seenBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "UserModel",
        },
    ],
},
    { timestamps: true }
)

export default mongoose.model<IMessage>("MessageModel", MessageSchema);

