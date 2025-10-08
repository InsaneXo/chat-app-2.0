import { Request, Response } from "express"
import chat from "../models/chat"
import mongoose from "mongoose"
import message from "../models/message";

const showChatList = async (req: Request, res: Response) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.userId);
        const chatList = await chat.aggregate([
            {
                $match: {
                    participants: userId
                }
            },
            {
                $lookup: {
                    from: "usermodels", // your user collection name
                    localField: "participants",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $addFields: {
                    otherUser: {
                        $filter: {
                            input: "$userDetails",
                            as: "user",
                            cond: { $ne: ["$$user._id", userId] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    "otherUser._id": 1,
                    "otherUser.name": 1,
                    "otherUser.email": 1,
                    "otherUser.avatarUrl": 1,
                    "otherUser.status": 1
                }
            }
        ]);

        return res.status(200).json({ chats: chatList })

    } catch (error) {
        console.log("Show Chat List Controller : ", error)
        res.status(500).json({ message: "Something Went Wrong" })
    }
}

const sendMessage = async (req: Request, res: Response) => {
    try {
        const { chatId, content } = req.body

        if (!chatId || !content) {
            return res.status(400).json({ message: "All Fields are Requried" })
        }

        const isChatExist = await chat.exists({ _id: chatId })

        if (!isChatExist) {
            return res.status(404).json({ message: "Chat not Found" })
        }

        await message.create({
            sender: req.userId,
            chatId,
            content: content.body,
            messageType: content.type
        })

        return res.status(200).json({ message: "Message Sent Successfully" })
    } catch (error) {
        console.log("Send Message Controller : ", error)
        return res.status(500).json({ message: "Something Went Wrong" })
    }
}

export { showChatList, sendMessage }