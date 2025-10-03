import { Icon } from '@iconify/react';
import type { CustomIconProps } from '../../types/component';

const CustomIcon = ({ name, className }: CustomIconProps) => {
    return <Icon icon={name} className={`text-lg w-5 h-5 ${className || ''}`} width={30} />
}

export default CustomIcon