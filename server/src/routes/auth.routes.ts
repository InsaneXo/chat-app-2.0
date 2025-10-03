import express from "express"
import { forgetpassword, getWork, login, newPassword, register, verifyForgetPasswordOTP, verifyOTP } from "../controllers/auth.controllers"
import auth from "../middlewares/auth.middleware"

const authRouter = express.Router()

authRouter.get('/login2', getWork)

authRouter.post('/register', register)
authRouter.post('/verify-otp', verifyOTP)
authRouter.post('/verify-forget-password', verifyForgetPasswordOTP)

authRouter.post('/login', login)
authRouter.post('/forget-password', forgetpassword)
authRouter.post('/new-password', newPassword)


export default authRouter