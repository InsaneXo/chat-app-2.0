import React, { useState } from 'react'
import CustomContextMenu from './CustomContextMenu'
import type { ContextMenuDataProps, CustomContextMenuProps } from '../../types/component';
import CustomIcon from './CustomIcon';
import { useStore } from '../../context/StoreProvider';

interface CustomChatItemProps {
    _id:string;
    avatar: string;
    userId:string
    name: string;
    message: string;
    day: string;
    unreadMessage: string
    onContextMenuData: ContextMenuDataProps[]
}

const CustomChatItem = ({ _id, avatar, userId, name, message, day, unreadMessage, onContextMenuData }: CustomChatItemProps) => {
    const [position, setPosition] = useState<CustomContextMenuProps | null>(null);
    const { selectedChatDetails, setSelectedChatDetails } = useStore()

    const handleClose = () => setPosition(null)

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setPosition({ x: e.clientX, y: e.clientY });
    }

    return (
        <>
            <div className={`h-20 w-full ${selectedChatDetails._id === _id && "bg-[#F6F5F4]"}  hover:bg-[#F6F5F4] rounded-lg px-2 flex items-center gap-2 mb-[2px] cursor-pointer relative`} onContextMenu={handleContextMenu} onClick={() => setSelectedChatDetails({_id, userId, name, avatar})}>
                <div className='h-14 w-14 flex items-center justify-center bg-green-300 text-white rounded-full'>
                    {avatar ? (
                        <img src={avatar} alt="user_avatar" className="h-full w-full object-cover" />
                    ) : (
                        <CustomIcon name="solar:user-linear" className="h-7 w-7" />
                    )}
                </div>
                <div className='flex-1 flex flex-col gap-[2px]'>
                    <div className='flex justify-between items-center'>
                        <h1 className=''>{name}</h1>
                        <p className='font-light text-[13px] text-gray-400'>Today</p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-light text-[13px] text-gray-400'>Hello World</h1>
                        <div className='h-4 w-4 bg-[#1DAA61] rounded-full flex justify-center items-center text-white text-[10px]'>3</div>
                    </div>
                </div>
            </div>
            {position && <CustomContextMenu position={position} onClose={handleClose} data={onContextMenuData} />}
        </>
    )
}

export default CustomChatItem