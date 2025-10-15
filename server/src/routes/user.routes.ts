import express from "express"
import { friendRequestHandler, friendRequestList, searchUsers, sendFriendRequest } from "../controllers/user.contollers"

const userRouter = express.Router()

userRouter.get('/friend-request', friendRequestList)
userRouter.post("/friend-request", sendFriendRequest)

userRouter.put("/friend-request", friendRequestHandler)
userRouter.get('/search', searchUsers)

export default userRouter