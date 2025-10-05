import express from "express"
import { sendFriendRequest } from "../controllers/user.contollers"

const userRouter = express.Router()

userRouter.post("/friend-request", sendFriendRequest)

export default userRouter