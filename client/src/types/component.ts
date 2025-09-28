export interface CustomIconProps {
    name: string;
    className?: string
}

export interface CustomInputProps {
    label: string;
    iconName: string;
    iconClassName: string;
    type:string;
    action?: boolean;
}

export interface MessageItemProps {
 message: string;
  time: string;
  isSender?: boolean;
  isRead?: boolean;
}