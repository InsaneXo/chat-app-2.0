import React, {
  createContext,
  useMemo,
  useContext,
  type ReactNode
} from "react";
import { io, Socket } from "socket.io-client";


interface ServerToClientEvents {
  MESSAGE: (data: string) => void;
}

interface ClientToServerEvents {
  SEND_MESSAGE: (data: any) => void;
}


type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SocketContext = createContext<AppSocket | null>(null);

export const useSocket = (): AppSocket | null => {
  return useContext(SocketContext);
};


interface SocketProviderProps {
  children: ReactNode;
}



export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useMemo<AppSocket>(
    () =>
      io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
