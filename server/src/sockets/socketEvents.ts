import { Socket } from "socket.io"
import chat from "../models/chat";
import message from "../models/message";
import { getSockets } from "../utils/helper";
import user from "../models/user";



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
    socket: any
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

const seenAllMessage = async ({ io, socket, chatId, users, callback }: seenAllMessageTypes) => {
  try {
    if (!chatId) {
      return callback?.({
        status: 400,
        message: "All fields are required",
      });
    }

    const unseenMessages:any = await message.find({
      chatId,
      seenBy: { $ne: socket.userId },
    }).populate({
      path: "chatId",
      select: "participants",
    });

    if (unseenMessages.length === 0) {
      return callback?.({
        status: 200,
        message: "All messages already marked as read.",
      });
    }

    
    const isSender = unseenMessages.every(
      (msg:any) => msg.sender.toString() === socket.userId.toString()
    );

    if (isSender) {
      return callback?.({
        status: 200,
        message: "You are the sender, cannot mark your own messages as seen.",
      });
    }

    await message.updateMany(
      { chatId, seenBy: { $ne: socket.userId } },
      { $addToSet: { seenBy: socket.userId } }
    );

    const chatParticipants = unseenMessages[0].chatId.participants.filter(
      (id: any) => id.toString() !== socket.userId.toString()
    );

    const memberSockets = getSockets(chatParticipants);

    io.to(memberSockets).emit("SEEN_ALL_MESSAGE", { chatId });


  } catch (error) {
    console.error("Error in seenAllMessage:", error);
    return callback?.({
      status: 500,
      message: "Something went wrong.",
    });
  }
};


export { sendNewMessage, seenMessage, seenAllMessage }