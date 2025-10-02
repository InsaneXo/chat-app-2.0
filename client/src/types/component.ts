export interface CustomIconProps {
    name: string;
    className?: string
}

export interface CustomInputProps {
    label: string;
    iconName: string;
    iconClassName: string;
    register: any
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

export interface InputTypes {
    email?: string;
    password?:string;
    name?:string;
    otp?:string;
}

export interface OTPInputProps {
    length?: number;
    value?: string;
    onChange?: (val: string) => void;
};

export interface CustomToastMessageProps {
    name: string;
    message: string;
}