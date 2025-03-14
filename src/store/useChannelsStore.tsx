import { create } from "zustand";
import { ChannelSchema } from "../schemas/channel";

interface ChannelsStore {
  selectedChannel: ChannelSchema | null;
  selectChannel: (channel: ChannelSchema) => void;
}

const useChannelsStore = create<ChannelsStore>((set) => ({
  selectedChannel: null,

  selectChannel: (channel: ChannelSchema) => {
    set({ selectedChannel: channel });
  },
}));

export default useChannelsStore;
