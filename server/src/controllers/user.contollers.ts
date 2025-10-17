import { Request, Response } from "express";
import mongoose from "mongoose";
import friendRequest from "../models/friendRequest";
import user from "../models/user";
import chat from "../models/chat";
import { emitEvent } from "../utils/helper";

const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const { receiverId } = req.body

        if (!receiverId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingRequest = await friendRequest.exists({
            $or: [
                { sender: req.userId, receiver: receiverId },
                { sender: receiverId, receiver: req.userId }
            ]
        });

        if (existingRequest) {
            return res.status(200).json({ message: "Friend Request already sent" })
        }

        await friendRequest.create({
            receiver: receiverId,
            sender: req.userId
        })

        emitEvent(req, "SEND_REQUEST", [receiverId], "hello")

        return res.status(201).json({ message: "Friend Request Sent Successfuly" })
    } catch (error) {
        console.log("Send Friend Request Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const friendRequestList = async (req: Request, res: Response) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const friendRequestList = await friendRequest.aggregate([
            {
                $match: { status: "pending", receiver: new mongoose.Types.ObjectId(req.userId) }
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderDetails"
                }
            },
            {
                $unwind: "$senderDetails"
            },
            {
                $project: {
                    _id: 1,
                    senderId: "$senderDetails._id",
                    name: "$senderDetails.name",
                    email: "$senderDetails.email",
                }
            },
            { $sort: { senderName: 1 } },
            { $skip: skip },
            { $limit: limit }
        ])

        const totalCount = await friendRequest.countDocuments({
            status: "pending",
            receiver: req.userId?.toString()
        });

        return res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            user: friendRequestList
        })

    } catch (error) {
        console.log("Friend Request List : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const searchUsers = async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string;
        const loggedInUserId = new mongoose.Types.ObjectId(req.userId);

        const userFind = await user.aggregate([
            {
                $match: {
                    name: { $regex: name, $options: "i" },
                    _id: { $ne: loggedInUserId },
                    isActive: true,
                },
            },
            {
                $lookup: {
                    from: "friendrequestmodels",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ["$sender", loggedInUserId] },
                                                { $eq: ["$receiver", "$$userId"] },
                                            ],
                                        },
                                        {
                                            $and: [
                                                { $eq: ["$receiver", loggedInUserId] },
                                                { $eq: ["$sender", "$$userId"] },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "friendRequests",
                },
            },
            {
                $addFields: {
                    status: {
                        $cond: {
                            if: { $gt: [{ $size: "$friendRequests" }, 0] },
                            then: { $arrayElemAt: ["$friendRequests.status", 0] },
                            else: "not_friends",
                        },
                    },
                    senderId: {
                        $cond: {
                            if: { $gt: [{ $size: "$friendRequests" }, 0] },
                            then: { $arrayElemAt: ["$friendRequests.sender", 0] },
                            else: null,
                        },
                    },
                    requestId: {
                        $cond: {
                            if: { $gt: [{ $size: "$friendRequests" }, 0] },
                            then: { $arrayElemAt: ["$friendRequests._id", 0] },
                            else: null,
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    avatarUrl: 1,
                    status: 1,
                    senderId: 1,
                    requestId: 1,
                },
            },
            {
                $sort: { name: 1 },
            },
        ]);


        return res.status(200).json({ user: userFind });
    } catch (error) {
        console.log("Search Friends controller:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const friendRequestHandler = async (req: Request, res: Response) => {
    try {
        const { requestId, type } = req.body

        if (!requestId || !type) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        if (type !== "accepted" && type !== "rejected") {
            return res.status(400).json({ message: "Invaild Type" })
        }

        const message = type === "accepted" ? "Friend Request Accecpted" : "Friend Request Rejected"


        const isReqestIdExist = await friendRequest.findOne({ _id: requestId })

        if (!isReqestIdExist) {
            return res.status(404).json({ message: "Friend Request not found" })
        }

        if (isReqestIdExist.status === "accepted") {
            return res.status(200).json({ message: "Friend request already accepted" })
        }

        if (type === "rejected") {
            await friendRequest.deleteOne({ _id: requestId })
        }
        else {
            await friendRequest.updateOne({ _id: requestId }, { $set: { status: type } })
            await chat.create({
                participants: [isReqestIdExist.sender, isReqestIdExist.receiver]
            })
        }


        return res.status(200).json({ message })

    } catch (error) {
        console.log("Friend Request Handler Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}


export { sendFriendRequest, friendRequestList, searchUsers, friendRequestHandler }