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
                    participants: 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.email": 1,
                    "user.avatarUrl": 1,
                    "user.status": 1,
                    "latestMessage._id": 1,
                    "latestMessage.content": 1,
                    "latestMessage.createdAt": 1,
                    "latestMessage.seenBy": 1,
                    "latestMessage.sender": 1,
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

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({ message: "Not vaild Object id" })
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

        const updateDoc = await chat.findByIdAndUpdate(saveMessageToDb.chatId, {
            $set: {
                latestMessage: saveMessageToDb._id
            }
        }, {
            new: true
        })


        emitEvent(req, "MESSAGE", isChatExist?.participants, {
            chatId,
            message: realTimeDataMessageObj,
        })

        const sentAlert = updateDoc?.participants.filter((item) => item._id.toString() !== req.userId?.toString())

        emitEvent(req, "NOTIFICATION", sentAlert, { chatId: saveMessageToDb.chatId.toString(), type: "message", message: realTimeDataMessageObj })

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

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({ message: "Not vaild Object id" })
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

const seenMessage = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.body

        if (!messageId) {
            return res.status(400).json({ message: "All Fields are Requried" })
        }

        if (!mongoose.isValidObjectId(messageId)) {
            return res.status(400).json({ message: "Not vaild Object id" })
        }

        const isExistMessage = await message.findById(messageId)

        if (!isExistMessage) {
            return res.status(404).json({ message: "Message not found" })
        }

        const isOwnMessage = isExistMessage.sender.toString() === req.userId?.toString()

        if (isOwnMessage) {
            return res.status(200).json({ message: "You are the sender, cannot mark your own messages as seen." })
        }

        const updateMessageStatus: any = await message.findOneAndUpdate({ _id: messageId, seenBy: { $ne: req.userId?.toString() } }, {
            $addToSet: { seenBy: req.userId?.toString() },
        }, {
            new: true
        }).populate(
            {
                path: "chatId",
                select: "participants"
            }
        )

        const chatParticipants = updateMessageStatus?.chatId.participants

        const realTimeDataMessageObj = {
            _id: updateMessageStatus._id,
            sender: updateMessageStatus.sender,
            content: updateMessageStatus.content,
            messageType: updateMessageStatus.messageType,
            seenBy: updateMessageStatus.seenBy,
            createdAt: updateMessageStatus.createdAt
        }

        emitEvent(req, "SEEN_MESSAGE", chatParticipants, { chatId: updateMessageStatus?.chatId._id, messageId, user: req.userId?.toString(), message: realTimeDataMessageObj })

        return res.status(200).json({
            message: "Message Seen"
        })

    } catch (error) {
        console.log("Seen Message Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const seenAllMessages = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.body

        if (!chatId) {
            return res.status(400).json({ message: "All Fields are requried" })
        }

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({ message: "Not vaild Object id" })
        }

        const unseenMessages: any = await message.find({
            chatId,
            seenBy: { $ne: req.userId?.toString() }
        }).populate({
            path: "chatId",
            select: "participants"
        })

        if (unseenMessages.length === 0) {
            return res.status(200).json({ message: "All messages already marked as read." })
        }

        const isSender = unseenMessages.every((msg: any) => msg.sender.toString() === req.userId?.toString())

        if (isSender) {
            return res.status(200).json({
                message: "You are the sender, cannot mark your own messages as seen."
            })
        }

        await message.updateMany({
            chatId, seenBy: { $ne: req.userId?.toString() }
        },
            { $addToSet: { seenBy: req.userId?.toString() } }
        );

        const chatParticipants = unseenMessages[0].chatId.participants.filter(
            (id: any) => id.toString() !== req.userId?.toString()
        );

        emitEvent(req, "SEEN_ALL_MESSAGE", chatParticipants, { chatId, messages: unseenMessages, user: req.userId?.toString() })
        return res.status(200).json({
            message: "All Messages are seen"
        })

    } catch (error) {
        console.log("Seen All Message Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const typingChat = async (req: Request, res: Response) => {
    try {
        const { members, chatId, isTyping } = req.body

        console.log(members, chatId, isTyping, "HEllo")

        if (!members || !chatId || !isTyping) {
            return res.status(400).json({ message: "All Field are requried" })
        }

        emitEvent(req, "TYPING", [members], { members, chatId, isTyping })

        return res.status(200).json({ message: "User Typing" })
    } catch (error) {
        console.log("Seen All Message Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export { showChatList, sendMessage, showMessageList, seenMessage, seenAllMessages, typingChat }