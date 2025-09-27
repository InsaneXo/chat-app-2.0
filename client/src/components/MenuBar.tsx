import React from 'react'
import CustomIcon from './UI/CustomIcon'

const MenuBar = () => {
  return (
    <div className='h-full w-16 bg-[#F7F5F3] border-r-[2px] border-gray-200 p-2 flex flex-col justify-between'>
      <div className='border-b-[2px] border-gray-200'>
        <div className='h-10 w-10 bg-[#EAE8E6] hover:bg-[#EAE8E6] rounded-full flex justify-center items-center mb-2 relative cursor-pointer'>
          <CustomIcon name='mdi:chat-bubble' />
          {/* mdi:chat-bubble-outline */}
          <div className='h-4 w-4 bg-[#1DAA61] rounded-full flex justify-center items-center text-white text-[10px] absolute right-0 top-[-4px] border-2 border-[#F7F5F3]'>3</div>
        </div>
        <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center mb-2 cursor-pointer'>
          <CustomIcon name='majesticons:chat-status' />
          {/* majesticons:chat-status-line */}
        </div>
      </div>
      <div className=''>
        <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center mb-2 cursor-pointer'>
          <CustomIcon name='lets-icons:setting-fill' />
          {/* lets-icons:setting-line */}
        </div>
        <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center mb-2 cursor-pointer'>
          <div className='h-8 w-8 rounded-full bg-amber-100' ></div>
        </div>
      </div>
    </div>
  )
}

export default MenuBar