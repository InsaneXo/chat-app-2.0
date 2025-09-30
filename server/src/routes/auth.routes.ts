import express from "express"
import { forgetpassword, login, register, verifyOTP } from "../controllers/auth.controllers"

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/verify-otp', verifyOTP)
authRouter.post('/login', login)
authRouter.post('/forget-password', forgetpassword)

export default authRouter