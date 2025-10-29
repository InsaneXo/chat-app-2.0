import express from "express"
import { seenAllMessages, seenMessage, sendMessage, showChatList, showMessageList } from "../controllers/chat.controllers"

const chatRouter = express.Router()

chatRouter.get("/", showChatList)
chatRouter.get("/message", showMessageList)
chatRouter.post("/message", sendMessage)
chatRouter.put("/message/seen", seenMessage)
chatRouter.put("/message/seen-all", seenAllMessages)

export default chatRouter