import { create } from "zustand";
import api from "../api/api";
import { ChannelSchema } from "../schemas/channel.schema";
import { MessageSchema } from "../schemas/message.schema";

interface ChannelsStore {
  channels: ChannelSchema[] | null;
  selectedChannel: ChannelSchema | null;
  isChannelsLoading: boolean;
  loadChannels: () => Promise<void>;
  selectChannel: (channel: ChannelSchema) => void;
  newMessage: (message: MessageSchema) => void;
}

const useChannelsStore = create<ChannelsStore>((set, get) => ({
  channels: null,
  selectedChannel: null,
  isChannelsLoading: false,

  loadChannels: async () => {
    set({ isChannelsLoading: true });
    try {
      const channels = await api.getUserChannels();
      set({ channels: channels });
    } catch (err) {
      console.error("Error fetching channels:", err);
    } finally {
      set({ isChannelsLoading: false });
    }
  },

  selectChannel: (channel: ChannelSchema) => {
    set({ selectedChannel: channel });
  },

  newMessage: (message: MessageSchema) => {
    set((state) => {
      const channelIndex = state.channels?.findIndex((c) => c.id === message.channelId);

      if (channelIndex === undefined || channelIndex === -1) {
        throw new Error("Channel was not found");
      }

      const updatedChannels = state.channels?.map((channel, index) => {
        if (index === channelIndex) {
          return {
            ...channel,
            lastMessage: {
              id: message.id,
              authorId: message.author.id,
              authorUsername: message.author.username,
              authorGlobalName: message.author.globalName,
              content: message.content,
              timestamp: message.timestamp,
              editedTimestamp: message.editedTimestamp,
              attachmentsCount: message.attachments.length,
            },
          };
        }
        return channel;
      });

      return { channels: updatedChannels };
    })
  },
}));

export default useChannelsStore;
