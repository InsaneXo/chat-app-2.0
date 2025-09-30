import bcrypt from "bcrypt"
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

const JWTTokenGenreted = (payload: string) => {
    return jwt.sign({sessionId: payload}, process.env.JWT_SECRET as string, { expiresIn: "14d" })
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




export { hashingPassword, decryptPassword, generateSixDigitCode, JWTTokenGenreted, generateRandomString }