import { useEffect } from "react";

const UseSocketEvents = (socket:any, handlers:any) => {
  useEffect(() => {
    console.log("UseEffect Socket call")
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
        console.log("Use Effect Call")
      });
    };
  }, [socket, handlers]);
};

export { UseSocketEvents }

