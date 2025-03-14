import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import {
  ChannelCreateEventSchema,
  MessageCreateEventSchema,
} from "../schemas/gateway";
import useSelectedChannelStore from "./useSelectedChannelStore";
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
      const { selectedChannel } = useSelectedChannelStore.getState();
    });

    socket.on("channel:new", (message: ChannelCreateEventSchema) => {
    });

    set({ socket });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));

export default useGateway;
