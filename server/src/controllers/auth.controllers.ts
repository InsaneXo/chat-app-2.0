import { Request, Response } from "express";
import user from "../models/user";
import { decryptPassword, generateRandomString, generateSixDigitCode, hashingPassword, JWTTokenGenreted } from "../utils/helper";
import sendMail from "../services/smtp.services";

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body

        if (!name || !email || !password || !phone) {
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
            phone,
            password: hashedPassword,
            otp: generateOTP
        }, { new: true, upsert: true })

        sendMail({
            subject: "Confirm your account",
            to: userInfo?.email as string,
            text: `Your OTP is ${generateOTP}`,
        })

        return res.status(200).json({ message: `OTP Sent Successfully on ${email}` })
    } catch (error) {
        console.log("Register Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        const isExistUser = await user.exists({ email, isActive: true })

        if (isExistUser) {
            return res.status(400).json({ message: "User already exist. Try with different email account." })
        }

        const findUser = await user.findOne({ email })

        if (!findUser) {
            return res.status(404).json({ message: "User not found. Please register first." })
        }

        if (findUser?.otp !== otp) {
            return res.status(401).json({ message: "Invalid OTP. Please try again." })
        }

        await user.findOneAndUpdate({ email }, {
            $set: {
                isActive: true
            },
            $unset: {
                otp: 1
            }
        })

        return res.status(200).json({ message: "User created successfully" })
    } catch (error) {
        console.log("Verify OTP Contoller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        const isUserExist = await user.findOne({ email }).select("+password")

        if (!isUserExist) {
            return res.status(404).json({ message: 'User not found. Please register first.' })
        }

        const isMatched = decryptPassword(password, isUserExist.password)

        if (!isMatched) {
            return res.status(401).json({ message: "Invaild Credentials. Please Try Again." })
        }

        const generateSessionString = generateRandomString(22)

        await user.updateOne({ email: isUserExist.email }, { $set: { session: generateSessionString } })

        const generateToken = JWTTokenGenreted(generateSessionString)

        return res.status(200).json({ authToken: generateToken })
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
        sendMail({
            subject: "Forget your password",
            to: email,
            text: `Your OTP is ${generateOTP}`,
        })

        return res.status(200).json({ message: `OTP Sent Successfully on ${email}` })

    } catch (error) {
        console.log("Forgetpassword Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const newPassword = async (req: Request, res: Response) => {
    try {
        const { newPassword } = req.body

        
    } catch (error) {
        console.log("New Password Controller : ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}


export { register, verifyOTP, login, newPassword, forgetpassword }