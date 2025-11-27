require('dotenv').config()
require('./config/db')

import express from "express"
import cors from "cors"

import { Server } from "socket.io"
import { createServer } from "http";
import router from "./routes/index"
import { corsOptions } from "./config/constant/config"
import { socketMiddleware } from "./middlewares/auth.middleware"
import ErrorHandler from "./utils/helper"
import { seenAllMessage, seenMessage, sendNewMessage } from "./sockets/socketEvents"
import socketConnection from "./services/socket.services"

const app = express()
const server = createServer(app);
const PORT = 3001

export const userSocketIDs = new Map();
const onlineUsers = new Set();

const io = new Server(server, {
    cors: corsOptions
})


app.set("io", io);



app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use('/api', router)


io.use(socketMiddleware)

socketConnection(io)

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})