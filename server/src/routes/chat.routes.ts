import express from "express"
import { sendMessage, showChatList } from "../controllers/chat.controllers"

const chatRouter = express.Router()

chatRouter.get("/", showChatList)
chatRouter.post("/message", sendMessage)

export default chatRouter