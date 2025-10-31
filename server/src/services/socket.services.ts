import user from "../models/user";
import { userSocketIDs } from "../server";

const socketConnection = (io: any) => {
    io.on("connection", (socket: any) => {
        console.log("User is connected to socket")

        const userId = socket.userId;
        userSocketIDs.set(userId.toString(), socket.id);


        socket.on("disconnect", () => {
            console.log("User is disconnected to socket")
        });
    })
}

export default socketConnection