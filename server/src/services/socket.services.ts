import { userSocketIDs } from "../server";

const socketConnection = (io:any) =>{
    io.on("connection", (socket: any) => {
        console.log("User is connected to socket")
    
        const user = socket.userId;
        userSocketIDs.set(user.toString(), socket.id);
    
        
        socket.on("disconnect", () => {
            console.log("User is disconnected to socket")
        });
    })
}

export default socketConnection