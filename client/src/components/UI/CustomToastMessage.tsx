import React from 'react'
import CustomIcon from './CustomIcon'
import type { CustomToastMessageProps } from '../../types/component'

const CustomToastMessage = ({ name, message }: CustomToastMessageProps) => {
    return (
        <div className='absolute w-72 h-14 rounded-sm bg-white flex items-center overflow-hidden 
                top-10 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='h-full bg-green-500 w-2'></div>
            <div className='flex-1 flex items-center h-full '>
                <CustomIcon name={name} className='mx-2 text-green-500' />
                <div>
                    <div className='font-semibold text-green-500'>Success</div>
                    <p className='text-[12px] text-gray-500'>{message}</p>
                </div>
            </div>
            <div className='h-full w-5 cursor-pointer'>
                <CustomIcon name="basil:cross-outline" />
            </div>
        </div>
    )
}

export default CustomToastMessage