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

app.use('/api', router)
app.get("/", (req, res) => {
    res.send("Hello World");
});

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        return next(new ErrorHandler("Please login to access this route", 401));
    }
    await socketMiddleware(socket, next)
})


io.on("connection", (socket: any) => {
    console.log("User is connected to socket")

    const user = socket.userId;
    userSocketIDs.set(user.toString(), socket.id);
    console.log(socket.id, "socket")

    socket.on('SEND_MESSAGE', async ({ chatId, content }: any, callback?: any) => {
        sendNewMessage({ io, socket, callback, chatId, content })
    })

    socket.on('SEEN_MESSAGE', async ({ messageId, users }: any, callback?: any) => {
        seenMessage({ io, messageId, callback, users })
    })

    socket.on('SEEN_ALL_MESSAGE', async ({ chatId, users }: any, callback?: any) => {
        seenAllMessage({ io, socket, chatId, callback })
    })



    socket.on("disconnect", () => {
        console.log("User is disconnected to socket")
    });
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})