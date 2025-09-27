import React from 'react'
import CustomIcon from './CustomIcon'

export const CustomSearchBar = () => {
    return (
        <div className=' relative'>
            <input className='w-full h-10 px-7 rounded-2xl 
          bg-[#F6F5F4] 
          border border-gray-300 
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#29D369] 
          focus:border-[#29D369] 
          transition-all duration-200' type='text' placeholder='Search chat' />
            <CustomIcon name='bitcoin-icons:search-filled' className="absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369] cursor-pointer" />

        </div>
    )
}
