import express from "express"
import { sendMessage, showChatList, showMessageList } from "../controllers/chat.controllers"

const chatRouter = express.Router()

chatRouter.get("/", showChatList)
chatRouter.get("/message", showMessageList)
chatRouter.post("/message", sendMessage)

export default chatRouter