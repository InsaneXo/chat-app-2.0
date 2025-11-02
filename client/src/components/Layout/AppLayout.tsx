import { Navigate, Route, Routes } from "react-router-dom"
import MenuBar from "../MenuBar"
import ChatWindow from "../../features/chat/ChatWindow"
import StatusWindow from "../../features/status/StatusWindow"
import Friends from "../../pages/Friends"
import Settings from "../../pages/Settings"
import Profile from "../../pages/Profile"
import { useSocket } from "../../context/SocketProvider"
import { useStore } from "../../context/StoreProvider"
import { useCallback } from "react"
import { UseSocketEvents } from "../../hooks/UseSocketEvents"
import { useToast } from "../../context/ToastMessageProvider"
import Notification from "../../pages/Notification"


const AppLayout = () => {
    const socket = useSocket()
    const { store, notification, setNotification, selectedChatDetails, setFriendRequest, setChatList } = useStore()
    const { setToast } = useToast()

    const notificationListerner = useCallback((data: any) => {
        switch (data.type) {
            case "message":
                console.log(data, "DAta")
                if (data.chatId === selectedChatDetails._id) return
                unreadChatMessageHandler(data)
                break;
            case "sendFriendRequest":
                setNotification(prev => ({
                    ...prev,
                    friendRequest: prev.friendRequest + 1
                }));
                setFriendRequest(prev => [...prev, data.realTimeData])
                break;
            case "requestAccept":
                setNotification(prev => ({
                    ...prev,
                    otherNotification: prev.otherNotification + 1
                }));
                setChatList((prev) => [...prev, data.realTimeData])
                break;
            default:
                setToast({ status: "Error", message: "Invaild Type" })
        }


    }, [store.userId, selectedChatDetails._id])

    const unreadChatMessageHandler = (data: any) => {
        setNotification(prev => {
            const exists = prev.unreadChatMessages.every(item => item._id === data.chatId);

            let updatedUnread: any = prev.unreadChatMessages.map(item => {
                if (item._id === data.chatId) {
                    console.log("Helloo world")

                    return { ...item,  totalUnreadCount: item.totalUnreadCount + 1 };
                }
                return item;
            });

            if (!exists) {
                console.log("Helloo")
                updatedUnread = [
                    ...updatedUnread,
                    { _id: data.chatId, totalUnreadCount: 1 }
                ];
            }

            return {
                ...prev,
                unreadChatMessages: updatedUnread
            };
        });
    };

    const socketListener = {
        ["NOTIFICATION"]: notificationListerner,
    };

    console.log(notification.unreadChatMessages, "Hello")

    UseSocketEvents(socket, socketListener)
    return (
        <>
            <MenuBar />
            <Routes>
                <Route path='/' element={<Navigate to={'/chats'} replace />} />
                <Route path='/chats' element={<ChatWindow />} />
                <Route path='/status' element={<StatusWindow />} />
                <Route path='/friends' element={<Friends />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/notification' element={<Notification />} />
                <Route path='*' element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default AppLayout