import axios from "axios"
import CustomIcon from "../components/UI/CustomIcon"
import { CustomSearchBar } from "../components/UI/CustomSearchBar"
import { CustomUserItem } from "../components/UI/CustomUserItem"
import useSearch from "../hooks/UseSearch"
import { useToast } from "../context/ToastMessageProvider"
import { useEffect, useState } from "react"

interface SearchTypeProps {
    _id: string;
    value: string
}

const Friends = () => {
    const { query, setQuery, results, loading, error } = useSearch("/api/user/search")
    const { setToast } = useToast()
    const [friendRequests, setFriendRequests] = useState<any[]>([])
    const [searchType, setSearchType] = useState<SearchTypeProps>()

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

    useEffect(() => {
        fetchFriendRequests()
    }, [])

    const requestHandler = () => {

        if (searchType?.value === "sendRequest") {
            sendFriendRequestHandler(searchType._id)
        }
        else if (searchType?.value === "rejectRequest") {

        }
    }

    const sendFriendRequestHandler = async (receiverId: string) => {
        try {
            const { data } = await axios.post("/api/user/friend-request", { receiverId })
            setToast({ status: "Success", message: data.message })
        } catch (error: any) {
            if (error) {
                setToast({ status: "Error", message: error.response.data.message })
            }
        }
    }

    if (error) setToast({ status: "Error", message: error })

    const displayList = query ? results : friendRequests

    return (
        <div className="flex-1 flex">
            <div className="h-full flex flex-col bg-white w-[35%] border-r-[2px] border-gray-200 p-1">
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

                <div className='flex-1 w-full overflow-auto'>
                    {displayList.map((item) => (
                        <CustomUserItem
                            key={item._id}
                            isSearch={!!query}
                            contextMenuActive={false}
                            user={item}
                            handler={setSearchType}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full h-screen flex flex-col bg-amber-300"></div>
        </div>
    )
}

export default Friends
