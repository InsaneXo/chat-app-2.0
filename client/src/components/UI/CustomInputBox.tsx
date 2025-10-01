import React, { useState } from 'react'
import CustomIcon from './CustomIcon';
import type { CustomInputProps } from '../../types/component';

const CustomInputBox = ({ label, iconName, iconClassName, register, action = false }: CustomInputProps) => {
    const [password, setPassword] = useState<boolean>(true)

    return (
        <div className='my-2 w-full h-12  mt-1 relative'>
            <input className='w-full h-full px-8 rounded-2xl 
          bg-[#FCF5EB] 
          border border-gray-300 
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#29D369] 
          focus:border-[#29D369] 
          transition-all duration-200' type={password && action === true ? "password" : "text"} {...register} placeholder={label} />
            <CustomIcon name={iconName} className={iconClassName} />
            {action && <div onClick={()=> setPassword(!password)}> <CustomIcon name={password ? "mdi:eye": "mdi:eye-off"} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#29D369] cursor-pointer" /> </div>}
        </div>
    )
}

export default CustomInputBox