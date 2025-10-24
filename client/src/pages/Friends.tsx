import axios from "axios"
import CustomIcon from "../components/UI/CustomIcon"
import { CustomSearchBar } from "../components/UI/CustomSearchBar"
import { CustomUserItem } from "../components/UI/CustomUserItem"
import useSearch from "../hooks/UseSearch"
import { useToast } from "../context/ToastMessageProvider"
import { useCallback, useEffect, useState } from "react"
import { useStore } from "../context/StoreProvider"
import { useNavigate, useNavigation } from "react-router-dom"
import { UseSocketEvents } from "../hooks/UseSocketEvents"
import { useSocket } from "../context/SocketProvider"
import Loader from "../components/UI/Loader"



interface setFriendRequestsType {
    _id: string;
    name: string;
    email: string;
    requestId: string
}

const Friends = () => {
    const { query, setQuery, results, setResults, loading: searchLoading, error } = useSearch("/api/user/search")
    const { setToast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)

    const { store, setNotification } = useStore()
    const [friendRequests, setFriendRequests] = useState<setFriendRequestsType[]>([])

    const socket = useSocket()

    const fetchFriendRequests = async () => {
        try {
            const { data } = await axios({
                url: "/api/user/friend-request",
                method: "GET",
            })
            setFriendRequests(data.user || [])
        } catch (err: any) {
            if (err) {
                setToast({ status: "Error", message: err.response.data.message })
            }
        }
    }



    const requestHandler = (id: string, type: string) => {

        if (type === "sendRequest") {
            sendFriendRequestHandler(id)
        }
        else if (type === "rejected" || type === "accepted") {
            FriendRequestHandler(id, type)
        }
        else {
            setToast({ status: "Error", message: "Invaild Search Type" })
        }
    }

    const sendFriendRequestHandler = async (id: string) => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/user/friend-request", { receiverId: id })
            setResults((prev) => prev.map((item) => item._id === id ? { ...item, status: "pending" } : item))
            setToast({ status: "Success", message: data.message })
        } catch (error: any) {
            if (error) {
                setToast({ status: "Error", message: error.response.data.message })
            }
        } finally {
            setLoading(false)
        }
    }

    const FriendRequestHandler = async (id: string, searchTypeValue: string) => {
        try {
            const { data } = await axios({
                url: "/api/user/friend-request",
                method: "PUT",
                data: {
                    requestId: id,
                    type: searchTypeValue
                }
            })
            if (query) {
                setResults((prev) => prev.filter((item) => item.requestId !== id))
            } else {
                setFriendRequests((prev) => prev.filter((item) => item._id !== id))
            }
            setNotification(prev => ({
                ...prev,
                friendRequest: prev.friendRequest - 1
            }))
            setToast({ status: "Success", message: data.message })
        } catch (error: any) {
            if (error) {
                setToast({ status: "Error", message: error.response.data.message })
            }
        }
    }
    const displayList = query ? results : friendRequests

    const sendRequestListener = useCallback((data: any) => {
        if (!store.userId) return
        setFriendRequests(prev => [...prev, data])
    }, [store.userId])

    const socketListener = {
        ["SEND_REQUEST"]: sendRequestListener,
    };

    // UseSocketEvents(socket, socketListener)
    useEffect(() => {
        fetchFriendRequests()
    }, [])



    if (error) setToast({ status: "Error", message: error })



    return (
        <div className="flex-1 flex">
            <div className="h-full flex flex-col bg-white w-[50%] border-r-[2px] border-gray-200 p-1">
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold my-5 text-[#29D369]'>ConnectWave</h1>
                    <div className='flex items-center gap-1'>
                        <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer'>
                            <CustomIcon name='qlementine-icons:menu-dots-16' />
                        </div>
                    </div>
                </div>
                <CustomSearchBar query={query} setQuery={setQuery} placeholder="Search Users" />
                <div className="my-5 flex items-center justify-between">
                    <div className="text-[#29D369]">{query ? "Search Users" : "Friend Requests"}</div>
                    <div className="h-4 w-4 rounded-full bg-[#1DAA61] flex items-center justify-center text-white text-[10px]">
                        {displayList.length}
                    </div>
                </div>

                <div className='flex-1 w-full justify-center overflow-auto'>
                    {loading || searchLoading ? <Loader name={query ? "Loading Users..." : "Loading Friend Requests..."} /> : (displayList.map((item) => (
                        <CustomUserItem
                            key={item._id}
                            loginId={store.userId}
                            isSearch={!!query}
                            user={item}
                            handler={requestHandler}
                        />
                    )))}

                    {
                        !displayList.length && <div className="flex justify-center py-4">
                            <div className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center space-x-2">
                                <span className="text-gray-700">{query ? "No Users Found." : "There are no friend requests here."}</span>
                            </div>
                        </div>
                    }

                </div>
            </div>

            <div className="w-full h-full flex justify-center items-center bg-gradient-to-b text-white">
                <div className="flex flex-col justify-center items-center text-center space-y-6 p-8 rounded-2xl shadow-lg bg-[#F6F5F4] backdrop-blur-lg">
                    <img
                        src="/images/favicon.png"
                        alt="connectWave_logo"
                        className="w-32 h-32 mb-2 animate-bounce-slow"
                    />
                    <h1 className="text-3xl font-semibold text-[#29D369]">ConnectWave</h1>
                    <p className="text-lg max-w-md text-gray-500 leading-relaxed">
                        Connect with new people! View and manage your friend requests to grow your chat circle.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Friends
