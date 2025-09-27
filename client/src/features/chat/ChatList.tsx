import React from 'react'
import CustomIcon from '../../components/UI/CustomIcon'
import { CustomSearchBar } from '../../components/UI/CustomSearchBar'
import ChatItem from '../../components/ChatItem'

const ChatList = () => {
    return (
        <div className='h-full flex flex-col bg-white w-[31%] border-r-[2px] border-gray-200 p-1'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold my-5 text-[#29D369]'>ConnectWave</h1>
                <div className='flex items-center gap-1'>
                    <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer'>
                        <CustomIcon name='mdi:user-add-outline' />
                        {/* mdi:user-add */}
                    </div>
                    <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer'>
                        <CustomIcon name='qlementine-icons:menu-dots-16' />
                    </div>
                </div>
            </div>
            <CustomSearchBar />
            <div className='my-3 flex gap-2'>
                <div className='w-fit p-1 rounded-lg bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer'>All</div>
                <div className='w-fit p-1 rounded-lg bg-[#F6F5F4] hover:bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer '>Unread</div>
                <div className='w-fit p-1 rounded-lg bg-[#F6F5F4] hover:bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer '>Favourites</div>
                <div className='w-fit p-1 rounded-lg bg-[#F6F5F4] hover:bg-[#D9FDD3] text-[13px] text-gray-600 border-2 border-gray-200 cursor-pointer '>Groups</div>
            </div>
            <div className='flex-1 w-full overflow-auto'>
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
            </div>
        </div>
    )
}

export default ChatList