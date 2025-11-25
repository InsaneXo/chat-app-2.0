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
  TYPING: (data: any) => void;
  SEEN_MESSAGE: (data: any) => void;
  SEEN_ALL_MESSAGE: (data: any) => void;
  CHAT_JOINED: (data: any) => void;
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
  const token = localStorage.getItem('token')

  if (!token) return

  const socket = useMemo<AppSocket>(
    () =>
      io(import.meta.env.VITE_API_URL, {
        auth: {
          token: token,
        },
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
