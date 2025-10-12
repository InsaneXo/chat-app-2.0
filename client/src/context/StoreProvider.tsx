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

interface StoreContextType {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
  selectedChatDetails: seletedChatDetailsType
  setSelectedChatDetails: React.Dispatch<React.SetStateAction<seletedChatDetailsType>>;
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

  return (
    <StoreContext.Provider value={{ store, setStore, selectedChatDetails, setSelectedChatDetails }}>
      {children}
    </StoreContext.Provider>
  );
};
