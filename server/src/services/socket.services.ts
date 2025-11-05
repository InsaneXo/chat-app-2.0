import user from "../models/user";
import { userSocketIDs } from "../server";
import { getSockets } from "../utils/helper";

const onlineUsers = new Set();
const socketConnection = (io: any) => {
    io.on("connection", (socket: any) => {
        console.log("User is connected to socket")

        const userId = socket.userId;
        userSocketIDs.set(userId.toString(), socket.id);


        socket.on("ONLINE_JOINED", ({ userId, members, chatId }: any) => {
            console.log(userId, members, chatId)
            onlineUsers.add(userId.toString())

            console.log(Array.from(onlineUsers), "Array.from(onlineUsers)")

            const membersSocket = getSockets(members);
            io.to(membersSocket).emit("ONLINE_JOINED", { users: Array.from(onlineUsers), chatId })
        })

        socket.on("disconnect", async () => {
            try {
                console.log("User is disconnected to socket")

                await user.findByIdAndUpdate(userId, {
                    $set: {
                        lastSeen: new Date()
                    }
                })
                userSocketIDs.delete(userId.toString());
            } catch (error) {
                console.log(error)
            }
        });
    })
}

export default socketConnection