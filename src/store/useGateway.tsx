import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import useAuthStore from "./useAuthStore";
import {
  ChannelCreateEventSchema,
  MessageCreateEventSchema,
} from "../schemas/gateway.schema";
import useMessagesStore from "./useMessagesStore";
import useChannelsStore from "./useChannelsStore";

const BASE_URL = "localhost:3000";

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

    const token = useAuthStore.getState().accessToken;

    const socket = io(BASE_URL, {
      query: {
        accessToken: token,
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
