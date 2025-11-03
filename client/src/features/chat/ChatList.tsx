import CustomIcon from '../../components/UI/CustomIcon'
import { CustomSearchBar } from '../../components/UI/CustomSearchBar'
import ChatItem from '../../components/UI/CustomChatItem'
import { useEffect, useState } from 'react'
import { useToast } from '../../context/ToastMessageProvider'
import useInfiniteScroll from '../../hooks/UseInfiniteScroll'
import axios from 'axios'
import type { ChatListTypes } from '../../types/component'
import { useStore } from '../../context/StoreProvider'


const ChatList = () => {
    const { setToast } = useToast()
    const { setSelectedChatDetails, setNotification, chatList, setChatList } = useStore()
    const [hasMore, setHasMore] = useState<boolean>(false)
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1)

    const fetchChatList = async () => {
        try {
            const { data } = await axios({
                url: "/api/chat",
                method: "GET",
                params: {
                    page,
                    limit: 18
                }
            })

            const newChatList: ChatListTypes[] = data.chats

            if (isInitialLoad) {
                setChatList(newChatList)
                setIsInitialLoad(false)
            }
            else {
                setChatList((prev) => [...prev, ...newChatList])
            }

            setPage((prev) => prev + 1)

            if (newChatList.length === 0 || page >= data.totalPages) {
                setHasMore(false)
            }
        } catch (error: any) {
            if (error) {
                setToast({ status: "Error", message: error.response.data.message })
            }
        }
    }

    const onclickHandler: any = (_id: string, name: string, avatar: string) => {

        setSelectedChatDetails({ _id, name, avatar })
        setNotification(prev => ({
            ...prev,
            unreadChatMessages: prev.unreadChatMessages.filter(item => item._id !== _id)
        }))
    }


    const { containerRef, loading } = useInfiniteScroll({ loadMore: fetchChatList, hasMore })


    useEffect(() => {
        fetchChatList()
    }, [])

    return (
        <div className='h-full flex flex-col bg-white w-[50%] border-r-[2px] border-gray-200 p-1'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold my-5 text-[#29D369]'>ConnectWave</h1>
                <div className='flex items-center gap-1'>
                    <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer'>
                        <CustomIcon name='qlementine-icons:menu-dots-16' />
                    </div>
                </div>
            </div>
            <CustomSearchBar placeholder='Search chat' />
            <div className='my-3 flex gap-2'>
                <div className='w-fit p-1 rounded-lg bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer'>All</div>
                <div className='w-fit p-1 rounded-lg bg-[#F6F5F4] hover:bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer '>Unread</div>
                <div className='w-fit p-1 rounded-lg bg-[#F6F5F4] hover:bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer '>Favourites</div>
                <div className='w-fit p-1 rounded-lg bg-[#F6F5F4] hover:bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer '>Groups</div>
            </div>
            <div ref={containerRef} className='flex-1 w-full overflow-auto'>
                {chatList.map((item) => <ChatItem key={item._id} data={item} onclickHandler={onclickHandler} />
                )}
                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center space-x-2">
                            <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-gray-700">Loading Chats...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatList