import express from "express"
import { checkAllNotifications, friendRequestHandler, friendRequestList, otherNotifications, removeNotifications, searchUsers, sendFriendRequest } from "../controllers/user.contollers"

const userRouter = express.Router()

userRouter.get('/friend-request', friendRequestList)
userRouter.post("/friend-request", sendFriendRequest)

userRouter.put("/friend-request", friendRequestHandler)
userRouter.get('/search', searchUsers)

userRouter.get('/notifications', otherNotifications)
userRouter.delete('/notifications', removeNotifications)
userRouter.put('/notifications', checkAllNotifications)

export default userRouter