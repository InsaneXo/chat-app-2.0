import React, { createContext, useContext, useState, type ReactNode } from "react";

interface StoreType {
  isAuthenticate: boolean;
  userId: string;
  userEmail?: string;
}

interface seletedChatDetailsType {
  _id: string;
  avatar: string;
  name: string
}
interface unreadChatMessagesType {
  _id: string;
  totalUnreadCount: number;
  latestMessage: string;
  time: string;
}

interface notificationType {
  friendRequest: number,
  unreadChatMessages: unreadChatMessagesType[],
}

interface StoreContextType {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
  selectedChatDetails: seletedChatDetailsType
  setSelectedChatDetails: React.Dispatch<React.SetStateAction<seletedChatDetailsType>>;
  notification: notificationType
  setNotification: React.Dispatch<React.SetStateAction<notificationType>>
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
    avatar: "",
    name: ""
  })

  const [notification, setNotification] = useState<notificationType>({
    friendRequest: 0,
    unreadChatMessages: []
  })


  return (
    <StoreContext.Provider value={{ store, setStore, selectedChatDetails, setSelectedChatDetails, notification, setNotification }}>
      {children}
    </StoreContext.Provider>
  );
};
