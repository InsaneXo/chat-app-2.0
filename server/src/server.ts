require('dotenv').config()
require('./config/db')

import express from "express"
import cors from "cors"

import { Server } from "socket.io"
import { createServer } from "http";
import router from "./routes/index"
import { corsOptions } from "./config/constant/config"

const app = express()
const server = createServer(app);
const PORT = 3001

const io = new Server(server, {
    cors: corsOptions
})


app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)
app.get("/", (req, res) => {
    res.send("Hello World");
});


io.on("connection", (socket) => {
    console.log("User is connected to socket")

    socket.on("sendMessage", (data) => {
        console.log(data)
    })

    socket.on("disconnect", () => {
        console.log("User is disconnected to socket")
    });
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})