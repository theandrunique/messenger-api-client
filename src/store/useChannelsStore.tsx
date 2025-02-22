import { create } from "zustand";
import { Channel } from "../entities";
import api from "../api/api";

interface ChannelsStoreState {
  channels: Channel[] | null;
  selectedChannel: Channel | null;
  isChannelsLoading: boolean;
  loadChannels: () => Promise<void>;
  selectChannel: (channel: Channel) => void;
}

const useChannelsStore = create<ChannelsStoreState>((set, get) => ({
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

  selectChannel: (channel: Channel) => {
    set({ selectedChannel: channel });
  },
}));

export default useChannelsStore;
