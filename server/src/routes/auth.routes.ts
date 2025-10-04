import express from "express"
import { forgetpassword, login, newPassword, register, session, verifyForgetPasswordOTP, verifyOTP } from "../controllers/auth.controllers"
import authMiddleware from "../middlewares/auth.middleware"

const authRouter = express.Router()

authRouter.get('/session', authMiddleware, session)

authRouter.post('/register', register)
authRouter.post('/verify-otp', verifyOTP)
authRouter.post('/verify-forget-password', verifyForgetPasswordOTP)

authRouter.post('/login', login)
authRouter.post('/forget-password', forgetpassword)
authRouter.post('/new-password', newPassword)


export default authRouter