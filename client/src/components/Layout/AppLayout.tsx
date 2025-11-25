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
import useAudio from "../../hooks/UseAudio"
import AlertNotification from "/audios/alert.mp3"
import AlertNotification2 from "/audios/alert2.mp3"



const AppLayout = () => {
    const socket = useSocket()
    const { toggle: toggle1 } = useAudio(AlertNotification)
    const { toggle: toggle2 } = useAudio(AlertNotification2)
    const { store, setNotification, selectedChatDetails, setFriendRequest, isTyping, setChatList, setIsTyping } = useStore()
    const { setToast } = useToast()

    const notificationListerner = useCallback((data: any) => {
        switch (data.type) {
            case "message":
                if (data.chatId === selectedChatDetails._id) return toggle2()
                unreadChatMessageHandler(data)
                toggle1()
                break;
            case "sendFriendRequest":
                setNotification(prev => ({
                    ...prev,
                    friendRequest: prev.friendRequest + 1
                }));
                setFriendRequest(prev => [...prev, data.realTimeData])
                toggle1()
                break;
            case "requestAccept":
                setNotification(prev => ({
                    ...prev,
                    otherNotification: prev.otherNotification + 1
                }));
                setChatList((prev) => [...prev, data.realTimeData])
                toggle1()
                break;
            default:
                setToast({ status: "Error", message: "Invaild Type" })
        }


    }, [store.userId, selectedChatDetails._id])

    const typingListener = useCallback((data: any) => {
        setIsTyping({
            status: data.isTyping,
            chatId: data.chatId
        })
    }, [store.userId, selectedChatDetails._id]);


    const unreadChatMessageHandler = (data: any) => {
        setNotification(prev => {
            const exists = prev.unreadChatMessages.some(item => item._id === data.chatId);

            let updatedUnread: any = prev.unreadChatMessages.map(item => {
                if (item._id === data.chatId) {
                    return { ...item, totalUnreadCount: item.totalUnreadCount + 1 };
                }
                return item;
            });

            if (!exists) {
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
        ["TYPING"]: typingListener
    };


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