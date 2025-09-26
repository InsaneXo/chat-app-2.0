import React from 'react'
import { Icon } from '@iconify/react';

interface CustomIconProps {
    name: string;
    className: string
}

const CustomIcon = ({ name, className }: CustomIconProps) => {
    return <Icon icon={name} className={`text-lg w-5 h-5 ${className || ''}`} />
}

export default CustomIcon