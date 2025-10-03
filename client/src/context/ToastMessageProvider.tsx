import { createContext, useContext, useState, type ReactNode, } from "react";
import CustomToastMessage from "../components/UI/CustomToastMessage";
import type { ToastType } from "../types/component";



interface ToastContextType {
  toast: ToastType,
  setToast: React.Dispatch<React.SetStateAction<ToastType>>
}


const ToastMessageContext = createContext<ToastContextType | undefined>(
  undefined
);

export const useToast = () => {
  const context = useContext(ToastMessageContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastMessageProvider");
  }
  return context;
};

type ToastMessageProviderProps = {
  children: ReactNode;
};

export const ToastMessageProvider = ({ children }: ToastMessageProviderProps) => {
  const [toast, setToast] = useState<ToastType>({
    status: '',
    message: ''
  });

  return (
    <ToastMessageContext.Provider value={{ toast, setToast }}>
      {children}
      <CustomToastMessage data={toast} />
    </ToastMessageContext.Provider>
  );
};
