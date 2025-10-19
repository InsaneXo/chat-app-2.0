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

const AppLayout = () => {
    const socket = useSocket()
    const { store, setNotification } = useStore()
    const { setToast } = useToast()

    const sendRequestListener = useCallback(() => {
        if (!store.userId) return
        setNotification(prev => ({
            ...prev,
            friendRequest: prev.friendRequest + 1
        }));
    }, [store.userId])

    const requestHandlerListener = useCallback((data: any) => {
        if (!store.userId) return
        setToast({ status: "Success", message: data.message })
    }, [store.userId])

    const socketListener = {
        ["SEND_REQUEST"]: sendRequestListener,
        ["REQUEST_HANDLER"]: requestHandlerListener
    };

    UseSocketEvents(socket, socketListener)
    return (
        <>
            <MenuBar />
            <Routes>
                <Route path='/' element={<Navigate to={'/chats'} replace />} />
                <Route path='/chats' element={<ChatWindow />}  />
                <Route path='/status' element={<StatusWindow />} />
                <Route path='/friends' element={<Friends />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='*' element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default AppLayout