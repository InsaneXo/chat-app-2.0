import { createContext, useContext, useState, type ReactNode, } from "react";
import CustomToastMessage from "../components/UI/CustomToastMessage";

type ToastContextType = {
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

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
  const [message, setMessage] = useState<string | null>(null);

  return (
    <ToastMessageContext.Provider value={{ message, setMessage }}>
      {children}
      <CustomToastMessage name="mdi:check-circle" message={message ?? ""} />
    </ToastMessageContext.Provider>
  );
};
