import { useEffect, useRef } from "react";
import { GatewayEventHandlers } from "./types";
import { useGateway } from "../components/GatewayProvider";

const useGatewayEvents = (handlers?: Partial<GatewayEventHandlers>) => {
  const { socket } = useGateway();
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!socket) return;
    if (!handlers) return;

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler as any);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler as any);
      });
    };
  }, [socket]);
};

export default useGatewayEvents;
