import { Request, Response } from "express";
import user from "../models/user";
import { generateSixDigitCode, hashingPassword } from "../utils/helper";
import sendMail from "../services/smtp.services";

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        const findUser = await user.findOne({ email, isActive: true })

        if (findUser) {
            return res.status(400).json({ message: "User already exist. Try with different email account." })
        }

        const hashedPassword = await hashingPassword(password)
        const generateOTP = generateSixDigitCode()

        const userInfo = await user.findOneAndUpdate({ email }, {
            name,
            email,
            phone,
            password: hashedPassword,
            otp: generateOTP
        }, { upsert: true })

        sendMail({
            subject: "Confirm your account",
            to: userInfo?.email as string,
            text: `Your OTP is ${generateOTP}`,
        })

        return res.status(200).json({ message: "User created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}


export { register }