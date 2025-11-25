import React, { useState } from 'react'
import CustomContextMenu from './CustomContextMenu'
import type { ContextMenuDataProps, CustomContextMenuProps } from '../../types/component';
import CustomIcon from './CustomIcon';
import { useStore } from '../../context/StoreProvider';

interface UserTypes {
    _id: string;
    avatar: string;
    messageCount: any;
    status: string;
    senderId: string;
    name: string;
    message: string | undefined;
    day: string;
}

interface latestMessageTypes {
    _id: string;
    content: string;
    createdAt: string;
    seenBy: string[]
    sender: string
}


interface ChatItemDataProp {
    _id: string,
    participants: string[];
    latestMessage: latestMessageTypes
    user: UserTypes
}

interface CustomChatItemProps {
    data: ChatItemDataProp
    onContextMenuData: ContextMenuDataProps[]
    onclickHandler: (_id: string, participants: string[], name: string, avatar: string, userId: string,) => void
}

const CustomChatItem = ({ data, onContextMenuData, onclickHandler }: CustomChatItemProps) => {
    const [position, setPosition] = useState<CustomContextMenuProps | null>(null);
    const { store, notification, selectedChatDetails, isTyping } = useStore()

    const handleClose = () => setPosition(null)

    const findUnreadChats = notification.unreadChatMessages.find((item) => item._id === data._id)

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setPosition({ x: e.clientX, y: e.clientY });
    }

    console.log(data.latestMessage.content, "Content")


    return (
        <>
            <div className={`h-20 w-full ${selectedChatDetails._id === data._id && "bg-[#F6F5F4]"}  hover:bg-[#F6F5F4] rounded-lg px-2 flex items-center gap-2 mb-[2px] cursor-pointer relative`} onContextMenu={handleContextMenu} onClick={() => onclickHandler(data._id, data.participants, data.user.name, data.user.avatar, data.user._id)}>
                <div className='h-14 w-14 flex items-center justify-center bg-green-300 text-white rounded-full'>
                    {data.user.avatar ? (
                        <img src={data.user.avatar} alt="user_avatar" className="h-full w-full object-cover" />
                    ) : (
                        <CustomIcon name="solar:user-linear" className="h-7 w-7" />
                    )}
                </div>
                <div className='flex-1 flex flex-col gap-[2px]'>
                    <div className='flex justify-between items-center'>
                        <h1 className=''>{data.user.name}</h1>
                        {data.latestMessage && data.latestMessage.createdAt && <p className='font-light text-[13px] text-gray-400'>{new Date(data.latestMessage.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>}

                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='flex gap-1'>
                            {isTyping.status === "true" && isTyping.chatId === data._id ? <div className='flex items-center gap-0.5'>
                                <CustomIcon name='eos-icons:typing' className='h-4 w-4 text-green-500' />
                                <h1 className='font-light text-[13px] text-green-500'>Typing</h1>
                            </div> : <>
                                {data.latestMessage && data.latestMessage.sender ? data.latestMessage.sender === store.userId && <CustomIcon name='hugeicons:tick-double-02' className={data.latestMessage.seenBy.length > 0 ? 'text-blue-500' : 'text-gray-500'} /> : <h1 className='font-light text-[13px] text-gray-400'>{data.latestMessage.content && data.latestMessage.content ? data.latestMessage.content : data.user.status}</h1>}
                            </>}

                        </div>
                        {findUnreadChats?.totalUnreadCount && findUnreadChats?.totalUnreadCount > 0 && <div className='h-4 w-4 bg-[#1DAA61] rounded-full flex justify-center items-center text-white text-[10px]'>{findUnreadChats?.totalUnreadCount}</div>}
                    </div>
                </div>
            </div>
            {position && <CustomContextMenu position={position} onClose={handleClose} data={onContextMenuData} />}
        </>
    )
}

export default CustomChatItem