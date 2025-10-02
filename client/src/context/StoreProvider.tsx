import React, { createContext, useContext, useState, type ReactNode } from "react";

interface StoreType {
  isAuthenticate: boolean;
  userId: string;
}

interface StoreContextType {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
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
    userId: ""
  });

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
};
