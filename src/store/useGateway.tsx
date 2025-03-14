import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import {
  ChannelCreateEventSchema,
  MessageCreateEventSchema,
} from "../schemas/gateway";
import useMessagesStore from "./useMessagesStore";
import useChannelsStore from "./useChannelsStore";
import env from "../env";
import { getTokens } from "../api/api";

interface GatewayStore {
  connect: () => void;
  disconnect: () => void;
  socket: Socket | null;
}

const useGateway = create<GatewayStore>((set, get) => ({
  socket: null,

  connect: () => {
    const currentSocket = get().socket;
    if (currentSocket) {
      currentSocket.disconnect();
    }

    const token = getTokens();

    const socket = io(env.GATEWAY_ENDPOINT, {
      query: {
        accessToken: token?.accessToken,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("message:new", (message: MessageCreateEventSchema) => {
      const { selectedChannel } = useChannelsStore.getState();
      const { currentMessages } = useMessagesStore.getState();

      if (selectedChannel?.id === message.payload.channelId) {
        useMessagesStore.setState({
          currentMessages: [...currentMessages, message.payload],
        });
      }

      useChannelsStore.getState().newMessage(message.payload);

      const channelExists = useChannelsStore
        .getState()
        .channels?.some((c) => c.id === message.payload.channelId);

      if (!channelExists) {
        console.log("Channel does not exist");
      }
    });

    socket.on("channel:new", (message: ChannelCreateEventSchema) => {
      const prevChannels = useChannelsStore.getState().channels;

      useChannelsStore.setState({
        channels: [...(prevChannels ?? []), message.payload],
      });
    });

    set({ socket });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));

export default useGateway;
