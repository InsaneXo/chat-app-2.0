import mongoose, { Schema } from "mongoose";
import { IOtherNotification } from "../types/models";

const OtherNotification: Schema<IOtherNotification> = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    message: {
        type: String,
        required: [true, "Message content is required"],
        trim: true,
    },
    avatar: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

export default mongoose.model<IOtherNotification>("OtherNotificationModel", OtherNotification);

