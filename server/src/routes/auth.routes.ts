import express from "express"
import { forgetpassword, login, newPassword, register, verifyForgetPasswordOTP, verifyOTP } from "../controllers/auth.controllers"

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/verify-otp', verifyOTP)
authRouter.post('/verify-forget-password', verifyForgetPasswordOTP)

authRouter.post('/login', login)
authRouter.post('/forget-password', forgetpassword)
authRouter.post('/new-password', newPassword)

export default authRouter