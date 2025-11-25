import user from "../models/user";
import { userSocketIDs } from "../server";
import { getSockets } from "../utils/helper";

const onlineUsers = new Set();
const socketConnection = (io: any) => {
    io.on("connection", (socket: any) => {
        console.log("User is connected to socket")

        const userId = socket.userId;
        userSocketIDs.set(userId.toString(), socket.id);


        socket.on("CHAT_JOINED", ({ userId, members }: any) => {
            onlineUsers.add(userId.toString())

            const membersSocket = getSockets(members);
            io.to(membersSocket).emit("ONLINE_USERS", { users: Array.from(onlineUsers) })
        })

        socket.on("disconnect", async () => {
            try {
                console.log("User is disconnected to socket")

                await user.findByIdAndUpdate(userId, {
                    $set: {
                        lastSeen: new Date()
                    }
                })
                onlineUsers.delete(userId.toString());
                socket.broadcast.emit("ONLINE_USERS", { users: Array.from(onlineUsers) });
            } catch (error) {
                console.log(error)
            }
        });
    })
}

export default socketConnection