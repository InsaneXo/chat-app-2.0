import { useEffect } from "react";

const UseSocketEvents = (socket:any, handlers:any) => {
  console.log(socket, handlers)
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { UseSocketEvents }

