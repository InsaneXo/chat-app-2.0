import { Request, Response } from "express";
import user from "../models/user";
import { decodedJWTToken, decryptPassword, generateRandomString, generateSixDigitCode, hashingPassword, JWTTokenGenreted } from "../utils/helper";
import sendMail from "../services/smtp.services";
import friendRequest from "../models/friendRequest";
import message from "../models/message";
import chat from "../models/chat";
import mongoose from "mongoose";

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        const userExist = await user.exists({ email, isActive: true })


        if (userExist) {
            return res.status(400).json({ message: "User already exist. Try with different email account." })
        }

        const hashedPassword = await hashingPassword(password)
        const generateOTP = generateSixDigitCode()

        const userInfo = await user.findOneAndUpdate({ email }, {
            name,
            email,
            password: hashedPassword,
            otp: generateOTP
        }, { new: true, upsert: true })

        const generateSessionString = generateRandomString(22)

        await user.updateOne({ email }, { $set: { sessions: { "loginUser": generateSessionString } } })

        const generateToken = JWTTokenGenreted(generateSessionString, "5m")

        sendMail({
            subject: "Confirm your account",
            to: userInfo?.email as string,
            text: `Your OTP is ${generateOTP}`,
        })

        return res.status(200).json({ message: `OTP Sent Successfully on ${email}`, token: generateToken })
    } catch (error) {
        console.log("Register Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { token, otp } = req.body;

        if (!token || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const decodedToken = decodedJWTToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        const isExistUser = await user.findOne({ "sessions.loginUser": decodedToken.sessionId, isActive: false });

        if (!isExistUser) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        if (isExistUser.otp !== otp) {
            return res.status(401).json({ message: "Invalid OTP. Please try again." });
        }

        await user.findOneAndUpdate(
            { _id: isExistUser._id },
            {
                $set: { isActive: true },
                $unset: {
                    otp: 1,
                    sessions: {
                        loginUser: 1,
                        forgetpassword: 1
                    }
                }
            }
        );

        return res.status(200).json({ message: "Create User Successfully" });

    } catch (error) {
        console.error("Verify OTP Controller: ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        const isUserExist = await user.findOne({ email, isActive: true }).select("+password")

        if (!isUserExist) {
            return res.status(404).json({ message: 'User not found. Please register first.' })
        }

        const isMatched = await decryptPassword(password, isUserExist.password)


        if (!isMatched) {
            return res.status(401).json({ message: "Invaild Credentials. Please Try Again." })
        }

        const generateSessionString = generateRandomString(22)

        await user.updateOne({ email: isUserExist.email }, { $set: { sessions: { "loginUser": generateSessionString } } })

        const generateToken = JWTTokenGenreted(generateSessionString)

        return res.status(200).json({ token: generateToken, userId: isUserExist._id, message: "User Logged In" })
    } catch (error) {
        console.log("Login Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const forgetpassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        const userExist = await user.exists({ email, isActive: true })

        if (!userExist) {
            return res.status(404).json({ message: 'User not found. Please register first.' })
        }

        const generateOTP = generateSixDigitCode()
        const generateSessionString = generateRandomString(22)
        const generateToken = JWTTokenGenreted(generateSessionString, "5m")

        await user.updateOne({ email }, { $set: { sessions: { "forgetPassword": generateSessionString }, otp: generateOTP } })

        sendMail({
            subject: "Forget your password",
            to: email,
            text: `Your OTP is ${generateOTP}`,
        })

        return res.status(200).json({ message: `OTP Sent Successfully on ${email}`, token: generateToken })

    } catch (error) {
        console.log("Forgetpassword Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}


const verifyForgetPasswordOTP = async (req: Request, res: Response) => {
    try {
        const { token, otp } = req.body;

        if (!token || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const decodedToken = decodedJWTToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        const isExistUser = await user.findOne({ "sessions.forgetPassword": decodedToken.sessionId, isActive: true });

        if (!isExistUser) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        if (isExistUser.otp !== otp) {
            return res.status(401).json({ message: "Invalid OTP. Please try again." });
        }

        return res.status(200).json({ message: "OTP Verified" });

    } catch (error) {
        console.error("Verify OTP Controller: ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const newPassword = async (req: Request, res: Response) => {
    try {
        const { newPassword, token } = req.body

        if (!newPassword || !token) {
            return res.status(400).json({ message: "Field are requried" })
        }

        const decodedToken = decodedJWTToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        const isExistUser = await user.exists({ "sessions.forgetPassword": decodedToken.sessionId });

        const hashedPassword = await hashingPassword(newPassword)

        await user.findOneAndUpdate({ _id: isExistUser?._id }, {
            $set: {
                password: hashedPassword
            },
            $unset: {
                otp: 1,
                sessions: {
                    loginUser: 1,
                    forgetpassword: 1
                }
            }
        })

        return res.status(200).json({ message: "Password updated successfully." })

    } catch (error) {
        console.log("New Password Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const session = async (req: Request, res: Response) => {
    try {
        const { userId, email } = req

        const friendRequestList = await friendRequest.countDocuments({ receiver: userId, status: "pending" })
        const unreadChatMessagesList = await chat.aggregate([
            {
                $match: {
                    participants: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "messagemodels",
                    localField: "_id",
                    foreignField: "chatId",
                    as: "messages"
                }
            },
            {
                $addFields: {
                    unreadMessages: {
                        $filter: {
                            input: "$messages",
                            as: "msg",
                            cond: {
                                $and: [
                                    { $ne: ["$$msg.sender", new mongoose.Types.ObjectId(userId)] },
                                    { $eq: [{ $size: "$$msg.seenBy" }, 0] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                // Keep only chats with unread messages > 0
                $match: {
                    $expr: { $gt: [{ $size: "$unreadMessages" }, 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalUnreadCount: { $size: "$unreadMessages" }
                }
            }
        ]);


        console.log(unreadChatMessagesList, "unreadChatMessagesList")


        const countList = {
            friendRequest: friendRequestList,
            unreadChatMessages: unreadChatMessagesList
        }

        return res.status(200).json({ userId, email, user: countList })
    } catch (error) {
        console.log("Session Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}


export { register, verifyOTP, verifyForgetPasswordOTP, login, newPassword, forgetpassword, session }
