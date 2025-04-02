import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import env from "../env";
import { getTokens } from "../api/api";
import useCurrentUser from "../api/hooks/useCurrentUser";
import { GatewayEventHandlers, GatewayEventType } from "../gateway/types";
import { updateUseUserChannelOnChannelUpdate, updateUseUserChannelOnMemberAdd, updateUseUserChannelOnMemberRemove, updateUseUserChannelOnMessageAck, updateUseUserChannelsOnNewChannel, updateUseUserChannelsOnNewMessage } from "../api/hooks/useUserChannels";
import { updateUseMessagesOnMessageCreate, updateUseMessagesOnMessageUpdate } from "../api/hooks/useMessages";
import { invalidateUseChannel } from "../api/hooks/useChannel";
import { useQueryClient } from "@tanstack/react-query";

interface GatewayContextType {
  socket: Socket | null;
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

export const GatewayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const isConnected = useRef(false);
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isConnected.current) return;

    const newSocket = io(env.GATEWAY_ENDPOINT, {
      query: { accessToken: getTokens()?.accessToken },
    });

    newSocket.on("connect", () => {
      console.log(
        `Connected to gateway ${env.GATEWAY_ENDPOINT} id: ${newSocket.id}`
      );
    });

    newSocket.on("error", (error) => {
      console.error("Gateway error:", error);
    });

    setSocket(newSocket);
    isConnected.current = true;

    return () => {
      newSocket.disconnect();
      setSocket(null);
      isConnected.current = false;
    };
  }, []);

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handlers: Partial<GatewayEventHandlers> = {
      [GatewayEventType.MESSAGE_CREATE]: (event) => {
        updateUseUserChannelsOnNewMessage(queryClient, event.message);
        updateUseMessagesOnMessageCreate(queryClient, event.message);
      },
      [GatewayEventType.MESSAGE_UPDATE]: (event) => {
        updateUseMessagesOnMessageUpdate(queryClient, event);
      },
      [GatewayEventType.CHANNEL_MEMBER_ADD]: (event) => {
        updateUseUserChannelOnMemberAdd(queryClient, event, currentUser!.id);
        invalidateUseChannel(queryClient, event.channelId);
      },
      [GatewayEventType.CHANNEL_MEMBER_REMOVE]: (event) => {
        updateUseUserChannelOnMemberRemove(queryClient, event, currentUser!.id);
        invalidateUseChannel(queryClient, event.channelId);
      },
      [GatewayEventType.CHANNEL_CREATE]: (event) => {
        updateUseUserChannelsOnNewChannel(queryClient, event.channel);
      },
      [GatewayEventType.CHANNEL_UPDATE]: (event) => {
        updateUseUserChannelOnChannelUpdate(queryClient, event);
        invalidateUseChannel(queryClient, event.channel.id);
      },
      [GatewayEventType.MESSAGE_ACK]: (event) => {
        updateUseUserChannelOnMessageAck(queryClient, event, currentUser!.id);
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler as any);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler as any);
      });
    };
  }, [socket, currentUser]);

  return (
    <GatewayContext.Provider value={{ socket }}>
      {children}
    </GatewayContext.Provider>
  );
};

export const useGateway = () => {
  const context = useContext(GatewayContext);
  if (!context) {
    throw new Error("useGateway must be used within a GatewayProvider");
  }

  return context;
};
