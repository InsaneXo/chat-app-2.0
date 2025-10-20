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
    messageId: string[];
    users: string
    callback: any
}

interface seenAllMessageTypes {
    io: any;
    chatId: string;
    users: string;
    callback: any;
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

const seenMessage = async ({ io, messageId, callback, users }: seenMessageTypes) => {
    try {
        console.log(messageId, users, "DSSS")
        if (!messageId) {
            return callback?.({
                status: 400,
                message: "All Fields are Requried"
            })
        }

        const messageIds = Array.isArray(messageId) ? messageId : [messageId];

        const updatedDoc = await Promise.all(
            messageIds.map(async (id) => {
                return await message.findByIdAndUpdate(
                    id,
                    { $addToSet: { seenBy: users } },
                    { new: true }
                ).populate({
                    path: "chatId",
                    select: "participants"
                })
            })
        );

        console.log(updatedDoc, "Dec")

        updatedDoc.forEach((item: any) => {
            const membersSocket = getSockets(item?.chatId.participants)

            io.to(membersSocket).emit("SEEN_MESSAGE", {
                chatId: item?.chatId._id, messageId: item._id, seenUser: users
            }
            );
        })



    } catch (error) {
        console.log(error, "error")
        return callback?.({
            status: 500,
            message: "Something went wrong"
        })
    }
}

const seenAllMessage = async ({ io, chatId, users, callback }: seenAllMessageTypes) => {
    try {

        if (!chatId) {
            return callback?.({
                status: 400,
                message: "All Fields are Requried"
            })
        }

        const unseenMessages = await message.find({ chatId, seenBy: [] }).populate({
            path: "chatId",
            select: "participants"
        })

        if (unseenMessages.length === 0) {
            return callback?.({
                status: 200,
                message: "All messages already seen",
            });
        }

        await message.updateMany(
            { chatId, seenBy: [] },
            { $addToSet: { seenBy: users } }
        );

        unseenMessages.forEach((item:any) => {
            const membersSocket = getSockets(item?.chatId.participants)
            io.to(membersSocket).emit("SEEN_ALL_MESSAGE", {
                chatId: item?.chatId._id, messageId: item._id, senderId: item.sender, seenUser: users
            }
            );
        })
        // const messageList = await message.updateMany({chatId, seenBy: []},{$set:{seenBy:users}}).populate({
        //     path: "chatId",
        //     select: "participants"
        // })

        console.log(unseenMessages)


    } catch (error) {
        return callback?.({
            status: 500,
            message: "Something went wrong"
        })
    }
}

export { sendNewMessage, seenMessage, seenAllMessage }