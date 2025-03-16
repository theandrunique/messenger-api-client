import { useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getTokens } from "../api/api";
import env from "../env";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChannelCreateEventSchema,
  MessageCreateEventSchema,
} from "../schemas/gateway";
import { updateUseUserChannelsOnNewMessage, updateUseUserChannelsOnNewChannel } from '../api/hooks/useUserChannels';
import { updateUseMessagesOnNewMessage } from "../api/hooks/useMessages";

interface GatewayReturnType {
  connect: () => void;
  disconnect: () => void;
}

const useGateway = (): GatewayReturnType => {
  const socket = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  const connect = () => {
    const token = getTokens();

    socket.current = io(env.GATEWAY_ENDPOINT, {
      query: {
        accessToken: token?.accessToken,
      },
    });

    setupEventListeners(socket.current);
  };

  const disconnect = () => {
    if (socket.current) socket.current.disconnect();
  };

  const setupEventListeners = (socket: Socket) => {
    socket.on("connect", () => {
      console.log(`Connected to gateway on ${env.GATEWAY_ENDPOINT}`);
    });

    socket.on("error", (error) => {
      console.error("Gateway error:", error);
    });

    socket.on("message:new", (event: MessageCreateEventSchema) => {
      updateUseUserChannelsOnNewMessage(queryClient, event);
      updateUseMessagesOnNewMessage(queryClient, event);
    });

    socket.on("channel:new", (event: ChannelCreateEventSchema) => {
      updateUseUserChannelsOnNewChannel(queryClient, event);
    });
  };

  return {
    connect,
    disconnect,
  };
};

export default useGateway;
