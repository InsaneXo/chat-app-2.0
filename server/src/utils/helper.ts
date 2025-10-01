import bcrypt from "bcrypt"
import { Response } from "express";
import jwt from "jsonwebtoken"

// Password Hashing Feature. 

const hashingPassword = async (plaintext: string) => {
    const saltRound = 12
    const hash = await bcrypt.hash(plaintext, saltRound);
    return hash;

}

const decryptPassword = async (plaintext: string, hashedPassword: string) => {
    return await bcrypt.compare(plaintext, hashedPassword)
}

const generateSixDigitCode = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
}

const JWTTokenGenreted = (payload: string, time:any = "14d") => {
    return jwt.sign({ sessionId: payload }, process.env.JWT_SECRET as string, { expiresIn: time })
}

const decodedJWTToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
}

const generateRandomString = (length: number = 10): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
};

const checkType = (type : string, res:Response) => {
    if (type === "login") {
        return "sessions.loginUser"
    }
    else if (type === "forget") {
        return "sessions.forgetPassword"
    }
    else {
        return res.status(400).json({message: "Invaild type"})
    }
}




export { hashingPassword, decryptPassword, generateSixDigitCode, JWTTokenGenreted, generateRandomString, decodedJWTToken, checkType }