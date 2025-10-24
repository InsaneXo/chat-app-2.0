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
  socket: any;
  messageId: string;
  callback: any
}

interface seenAllMessageTypes {
  io: any;
  socket: any
  chatId: string;
  callback: any;
}


const sendNewMessage = async ({ io, socket, callback, chatId, content }: newMessageTypes) => {

  try {

    if (!chatId || !content) {
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

    await chat.findByIdAndUpdate(saveMessageToDb.chatId, {
      $set: {
        latestMessage: saveMessageToDb._id
      }
    })

    const reciverMember = isChatExist?.participants.filter((msgId: any) => msgId.toString() !== socket.userId.toString()
    )
    const membersSocket = getSockets(isChatExist.participants)
    const receiverSocket = getSockets(reciverMember)

    io.to(membersSocket).emit("MESSAGE", {
      chatId,
      message: messageObj,
    });

    io.to(receiverSocket).emit("NOTIFICATION", { chatId })



  } catch (error) {
    console.log(error)
    return callback?.({
      status: 500,
      message: "Something went wrong"
    })
  }


}

const seenMessage = async ({ io, socket, messageId, callback, }: seenMessageTypes) => {
  try {
    if (!messageId) {
      return callback?.({
        status: 400,
        message: "All Fields are Requried"
      })
    }

    const isExistMessage = await message.findById({ _id: messageId })

    if (!isExistMessage) {
      return callback?.({
        status: 404,
        message: "Message Not Found"
      })
    }

    const isSender = isExistMessage.sender.toString() === socket.userId.toString()

    if (isSender) {
      return callback?.({
        status: 400,
        message: "You are the sender, cannot mark your own messages as seen."
      })
    }

    const updateDoc: any = await message.findOneAndUpdate({ _id: isExistMessage._id, seenBy: { $ne: socket.userId } }, {
      $addToSet: { seenBy: socket.userId }
    }, {
      new: true
    }).populate(
      {
        path: "chatId",
        select: "participants"
      })


    const chatParticipants = updateDoc?.chatId.participants.filter((msgId: any) => msgId.toString() !== socket.userId)

    const membersSocket = getSockets(chatParticipants)
    io.to(membersSocket).emit("SEEN_MESSAGE", {
      chatId: updateDoc.chatId._id, messageId: updateDoc._id, user: socket.userId
    })

  } catch (error) {
    console.log(error, "error")
    return callback?.({
      status: 500,
      message: "Something went wrong"
    })
  }
}

const seenAllMessage = async ({ io, socket, chatId, callback }: seenAllMessageTypes) => {
  try {
    if (!chatId) {
      return callback?.({
        status: 400,
        message: "All fields are required",
      });
    }

    const unseenMessages: any = await message.find({
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
      (msg: any) => msg.sender.toString() === socket.userId.toString()
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

    io.to(memberSockets).emit("SEEN_ALL_MESSAGE", { chatId, messages: unseenMessages, user: socket.userId });

  } catch (error) {
    console.error("Error in seenAllMessage:", error);
    return callback?.({
      status: 500,
      message: "Something went wrong.",
    });
  }
};


export { sendNewMessage, seenMessage, seenAllMessage }