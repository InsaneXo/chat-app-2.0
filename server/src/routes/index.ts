import express from "express"
import authRouter from "./auth.routes"
import authMiddleware from "../middlewares/auth.middleware"
import userRouter from "./user.routes"

const router = express.Router()

router.use('/auth', authRouter)
router.use('/user', authMiddleware, userRouter)

export default router