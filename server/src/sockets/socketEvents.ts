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
    callBack: ({ status, message }: callBackType) => void;
    content: contentType
}


const sendNewMessage = async ({ io, socket, callBack, chatId, content }: newMessageTypes) => {
    
    if (!chatId || !content) {
        return callBack({
            status: 400,
            message: "All Fields are Requried"
        })
    }

    const isChatExist: any = await chat.findOne({ _id: chatId })

    if (!isChatExist) {
        return callBack({
            status: 404,
            message: "All Fields are Requried"
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


}

export { sendNewMessage }