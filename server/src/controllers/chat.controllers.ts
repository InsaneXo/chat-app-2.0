import { Request, Response } from "express"
import chat from "../models/chat"
import mongoose from "mongoose"
import message from "../models/message";
import { emitEvent } from "../utils/helper";

const showChatList = async (req: Request, res: Response) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.userId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const chatList = await chat.aggregate([
            {
                $match: {
                    participants: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "usermodels", // collection name (check actual MongoDB collection)
                    localField: "participants",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $addFields: {
                    user: {
                        $first: {
                            $filter: {
                                input: "$userDetails",
                                as: "user",
                                cond: { $ne: ["$$user._id", new mongoose.Types.ObjectId(userId)] }
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "messagemodels",
                    localField: "latestMessage",
                    foreignField: "_id",
                    as: "latestMessage"
                }
            },
            {
                $unwind: {
                    path: "$latestMessage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.email": 1,
                    "user.avatarUrl": 1,
                    "user.status": 1,
                    "latestMessage._id": 1,
                    "latestMessage.content": 1,
                    "latestMessage.createdAt": 1,
                    "latestMessage.sender": 1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalCount = await chat.countDocuments({
            participants: userId
        })

        return res.status(200).json({ chats: chatList, currentPage: page, totalPages: Math.ceil(totalCount / limit) })

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

        const isChatExist: any = await chat.exists({ _id: chatId })

        if (!isChatExist) {
            return res.status(404).json({ message: "Chat not Found" })
        }

        const saveMessageToDb = await message.create({
            sender: req.userId,
            chatId,
            content: content.body,
            messageType: content.type
        })

        const realTimeDataMessageObj = {
            _id: saveMessageToDb._id,
            sender: saveMessageToDb.sender,
            content: saveMessageToDb.content,
            messageType: saveMessageToDb.messageType,
            seenBy: saveMessageToDb.seenBy,
            createdAt: saveMessageToDb.createdAt
        }

        await chat.findByIdAndUpdate(saveMessageToDb.chatId, {
            $set: {
                latestMessage: saveMessageToDb._id
            }
        })

        const receiver = isChatExist?.participants.filter((msgId: any) => msgId.toString() !== req.userId
        )
        emitEvent(req, "MESSAGE", isChatExist?.participants, {
            chatId,
            message: realTimeDataMessageObj,
        })

        emitEvent(req, "NOTIFICATION", receiver, { chatId })

        return res.status(200).json({ message: "Message Sent Successfully" })
    } catch (error) {
        console.log("Send Message Controller : ", error)
        return res.status(500).json({ message: "Something Went Wrong" })
    }
}

const showMessageList = async (req: Request, res: Response) => {
    try {
        const chatId = req.query.chatId as string
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!chatId) {
            return res.status(400).json({ message: "All Fields are requried" })
        }

        const messages = await message.aggregate([
            {
                $match: { chatId: new mongoose.Types.ObjectId(chatId) }
            },
            {
                $project: {
                    _id: 1,
                    sender: 1,
                    content: 1,
                    messageType: 1,
                    seenBy: 1,
                    createdAt: 1
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
        ])


        const totalCount = await message.countDocuments({
            chatId: new mongoose.Types.ObjectId(chatId)
        });

        return res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            messages
        })

    } catch (error) {
        console.log("Show Message List Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export { showChatList, sendMessage, showMessageList }