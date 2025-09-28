import React from 'react'
import CustomContextMenu from './UI/CustomContextMenu'

const ChatItem = () => {
    return (
            <div className='h-20 w-full hover:bg-[#F6F5F4] rounded-lg px-2 flex items-center gap-2 mb-[2px] cursor-pointer relative'>
                <div className='h-14 w-14 bg-amber-300 rounded-full'></div>
                <div className='flex-1 flex flex-col gap-[2px]'>
                    <div className='flex justify-between items-center'>
                        <h1 className=''>Bipin Singh</h1>
                        <p className='font-light text-[13px] text-gray-400'>Today</p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-light text-[13px] text-gray-400'>Hello World</h1>
                        <div className='h-4 w-4 bg-[#1DAA61] rounded-full flex justify-center items-center text-white text-[10px]'>3</div>
                    </div>
                </div>
                <CustomContextMenu/>
            </div>
    )
}

export default ChatItem