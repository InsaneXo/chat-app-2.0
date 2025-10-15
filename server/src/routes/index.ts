import express from "express"
import authRouter from "./auth.routes"
import {authMiddleware} from "../middlewares/auth.middleware"
import userRouter from "./user.routes"
import chatRouter from "./chat.routes"

const router = express.Router()

router.use('/auth', authRouter)
router.use('/user', authMiddleware, userRouter)
router.use('/chat', authMiddleware, chatRouter)

export default router