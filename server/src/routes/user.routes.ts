import express from "express"
import { friendRequestList, searchUsers, sendFriendRequest } from "../controllers/user.contollers"

const userRouter = express.Router()

userRouter.post("/friend-request", sendFriendRequest)
userRouter.get('/friend-request', friendRequestList)
// ?page=1&limit=5
userRouter.get('/search', searchUsers)

export default userRouter