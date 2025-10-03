import express from "express"
import authRouter from "./auth.routes"
import auth from "../middlewares/auth.middleware"

const router = express.Router()

router.use('/auth', auth, authRouter)

export default router