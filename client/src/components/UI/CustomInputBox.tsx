import React from 'react'
import CustomIcon from './CustomIcon';
import type { CustomInputProps } from '../../types/component';

const CustomInputBox = ({ label, iconName, iconClassName, register, action = false }: CustomInputProps) => {
    return (
        <div className='my-2 w-full h-12  mt-1 relative'>
            <input className='w-full h-full px-8 rounded-2xl 
          bg-[#FCF5EB] 
          border border-gray-300 
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#29D369] 
          focus:border-[#29D369] 
          transition-all duration-200' {...register} placeholder={label} />
            <CustomIcon name={iconName} className={iconClassName} />
            {action && <CustomIcon name='mdi:eye' className="absolute right-2 top-1/2 -translate-y-1/2 text-[#29D369] cursor-pointer" />}
        </div>
    )
}

export default CustomInputBox