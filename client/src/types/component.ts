export interface CustomIconProps {
    name: string;
    className?: string
    onClick? : () =>void
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
    newPassword?:string;
    confirmPassword?: string;
    name?:string;
    otp?:string;
    userCredential:boolean;
}

export interface OTPInputProps {
    length?: number;
    value?: string;
    onChange?: (val: string) => void;
};

export interface ToastType {
  status: string;
  message: string;
}


export interface CustomToastMessageProps {
    data:ToastType
}

export interface UserType {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
}

export interface ChatListTypes {
  _id: string;
  user: UserType
}
