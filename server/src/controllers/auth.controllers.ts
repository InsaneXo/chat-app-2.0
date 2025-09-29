import { Request, Response } from "express";
import user from "../models/user";

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body

        if(!name || !email || !password || !phone){
            return res.status(400).json({message: "All Fields are required"})
        }

        const findUser = await user.findOne({email})
        
        if (findUser){
            return res.status(400).json({message: "User already exist. Try with different email account."})
        }

        await user.create({
            name,
            email,
            phone,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Something went wrong"})
    }
}


export { register }