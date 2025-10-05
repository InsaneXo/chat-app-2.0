import { Request, Response } from "express";
import friendRequest from "../models/friendRequest";

const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const { receiverId } = req.body

        if (!receiverId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isFriendSent = await friendRequest.exists({sender: req.userId, receiver: receiverId})

        if(isFriendSent){
            return res.status(409).json({message: "Friend Request already sent"})
        }

        await friendRequest.create({
            receiver:receiverId,
            sender: req.userId
        })

        return res.status(201).json({message: "Friend Request Sent Successfuly"})
    } catch (error) {
        console.log("Send Friend Request Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export { sendFriendRequest }