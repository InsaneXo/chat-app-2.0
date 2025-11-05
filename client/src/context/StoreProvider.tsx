import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { ChatListTypes } from "../types/component";

interface StoreType {
  isAuthenticate: boolean;
  userId: string;
  userEmail?: string;
}

interface seletedChatDetailsType {
  _id: string;
  userId: string;
  participants : string[]
  avatar: string;
  name: string
}
interface unreadChatMessagesType {
  _id: string;
  totalUnreadCount: number;
  latestMessage: string;
  time: string;
}

// interface otherNotificationTypes {
//   _id: string;
//   message: string;
//   avatar: string;
//   createdAt: string
// }

interface notificationType {
  friendRequest: number;
  unreadChatMessages: unreadChatMessagesType[];
  otherNotification: number
}

interface FriendRequestListType {
  _id: string;
  name: string;
  email: string;
  requestId: string
}

interface IsTypingType {
  status: string;
  chatId: string;
}

interface StoreContextType {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
  selectedChatDetails: seletedChatDetailsType;
  setSelectedChatDetails: React.Dispatch<React.SetStateAction<seletedChatDetailsType>>;
  notification: notificationType;
  setNotification: React.Dispatch<React.SetStateAction<notificationType>>
  friendRequest: FriendRequestListType[];
  setFriendRequest: React.Dispatch<React.SetStateAction<FriendRequestListType[]>>
  chatList: ChatListTypes[];
  setChatList: React.Dispatch<React.SetStateAction<ChatListTypes[]>>
  isTyping: IsTypingType;
  setIsTyping: React.Dispatch<React.SetStateAction<IsTypingType>>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store, setStore] = useState<StoreType>({
    isAuthenticate: false,
    userId: "",
    userEmail: ""
  });
  const [selectedChatDetails, setSelectedChatDetails] = useState<seletedChatDetailsType>({
    _id: "",
    participants:[],
    userId: "",
    avatar: "",
    name: ""
  })

  const [notification, setNotification] = useState<notificationType>({
    friendRequest: 0,
    unreadChatMessages: [],
    otherNotification: 0
  })

  const [friendRequest, setFriendRequest] = useState<FriendRequestListType[]>([])
  const [chatList, setChatList] = useState<ChatListTypes[]>([])
  const [isTyping, setIsTyping] = useState<IsTypingType>({
    status: "false",
    chatId: ""
  })


  return (
    <StoreContext.Provider value={{ store, setStore, selectedChatDetails, setSelectedChatDetails, notification, setNotification, friendRequest, setFriendRequest, chatList, setChatList, isTyping, setIsTyping }}>
      {children}
    </StoreContext.Provider>
  );
};
