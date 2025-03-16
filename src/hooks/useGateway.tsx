import { useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getTokens } from "../api/api";
import env from "../env";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { ChannelCreateEventSchema, MessageCreateEventSchema } from "../schemas/gateway";
import { MessageSchema } from "../schemas/message";
import { ChannelSchema } from "../schemas/channel";

interface GatewayReturnType {
  connect: () => void;
  disconnect: () => void;
};

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
      queryClient.setQueryData(
        ["/channels/{channelId}/messages", event.payload.channelId],
        (oldData: InfiniteData<MessageSchema[]> | undefined) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: [
              [event.payload, ...oldData.pages[0]],
              ...oldData.pages.slice(1),
            ]
          }
        }
      );

      queryClient.setQueryData(
        ["/users/@me/channels"],
        (oldChannels: ChannelSchema[] | undefined) => {
          if (!oldChannels) return;
          return oldChannels.map((channel) => {
            channel.id === event.payload.channelId
              ? { ...channel, lastMessage: event.payload, lastMessageTimestamp: event.payload.timestamp }
              : channel
          });
        }
      );
    });

    socket.on("channel:new", (event: ChannelCreateEventSchema) => {
      queryClient.setQueryData(
        ["/users/@me/channels"],
        (oldChannels: ChannelSchema[] | undefined) => {
          if (!oldChannels) return;
          return [...oldChannels, event.payload];
        }
      )
    });
  };

  return {
    connect,
    disconnect,
  }
};

export default useGateway;
