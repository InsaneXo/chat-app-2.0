export interface CustomIconProps {
    name: string;
    className?: string
}

export interface CustomInputProps {
    label: string;
    iconName: string;
    iconClassName: string;
    type: string;
    action?: boolean;
}

export interface MessageItemProps {
    message: string;
    time: string;
    isSender?: boolean;
    isRead?: boolean;
}

export interface CustomContextMenuProps {
    x: number;
    y: number
}

export interface ContextMenuDataProps {
    icon: string;
    contextOption: string;
    handler: () => void
}