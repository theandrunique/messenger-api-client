import { create } from "zustand";
import { ChannelSchema } from "../schemas/channel";

interface SelectedChannelStore {
  selectedChannel: ChannelSchema | null;
  prevSelectedChannel: ChannelSchema | null;
  selectChannel: (channel: ChannelSchema) => void;
}

const useSelectedChannelStore = create<SelectedChannelStore>((set, get) => ({
  selectedChannel: null,
  prevSelectedChannel: null,

  selectChannel: (channel: ChannelSchema) => {
    const prevChannel = get().selectedChannel;
    if (prevChannel) {
      set({ prevSelectedChannel: prevChannel });
    }

    set({ selectedChannel: channel });
  },
}));

export default useSelectedChannelStore;
