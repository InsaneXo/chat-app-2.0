import { Socket } from "socket.io"
import chat from "../models/chat";
import message from "../models/message";
import { getSockets } from "../utils/helper";



interface callBackType {
    status: number;
    message: string;
}

interface contentType {
    body: string;
    type: string;
}

interface newMessageTypes {
    io: any;
    socket: any;
    chatId: string;
    callback: any
    content: contentType
}

interface seenMessageTypes {
    io: any;
    socket: any;
    messageId: string[];
    users: string
    callback:any
}


const sendNewMessage = async ({ io, socket, callback, chatId, content }: newMessageTypes) => {

    try {
        
        if (!chatId || !content) {
            console.log("HEllo")
            return callback?.({
                status: 400,
                message: "All Fields are Requried"
            })
        }

        const isChatExist: any = await chat.findOne({ _id: chatId })

        if (!isChatExist) {
            return callback?.({
                status: 404,
                message: "Chat not found"
            })
        }

        const saveMessageToDb = await message.create({
            sender: socket.userId,
            chatId,
            content: content.body,
            messageType: content.type
        })

        const messageObj = {
            _id: saveMessageToDb._id,
            sender: saveMessageToDb.sender,
            content: saveMessageToDb.content,
            messageType: saveMessageToDb.messageType,
            seenBy: saveMessageToDb.seenBy,
            createdAt: saveMessageToDb.createdAt
        }


        const membersSocket = getSockets(isChatExist.participants)

        io.to(membersSocket).emit("MESSAGE", {
            chatId,
            message: messageObj,
        });


    } catch (error) {
        return callback?.({
            status: 500,
            message: "Something went wrong"
        })
    }


}

const seenMessage = async ({ io, socket, messageId, callback, users }: seenMessageTypes) => {
    try {
        console.log(messageId,users,"DSSS")
        if (!messageId) {
            return callback?.({
                status: 400,
                message: "All Fields are Requried"
            })
        }

         const messageIds = Array.isArray(messageId) ? messageId : [messageId];

        // Update all messages — add receiver to seenBy if not already there
       await Promise.all(
            messageIds.map(async (id) => {
                return await message.findByIdAndUpdate(
                    id,
                    { $addToSet: { seenBy: users } },
                    { new: true }
                )
            })
        );

        console.log(socket.userId)

        const membersSocket = getSockets([socket.userId])
        console.log(membersSocket, "Hello")
         io.to(membersSocket).emit("SEEN_MESSAGE", {
            messageId: messageId[0]
        });

    } catch (error) {
        console.log(error,"error")
        return callback?.({
            status: 500,
            message: "Something went wrong"
        })
    }
}

export { sendNewMessage, seenMessage }