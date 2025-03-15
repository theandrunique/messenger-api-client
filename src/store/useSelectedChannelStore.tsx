import { create } from "zustand";
import { ChannelSchema } from "../schemas/channel";

interface SelectedChannelStore {
  selectedChannel: ChannelSchema | null;
  selectChannel: (channel: ChannelSchema) => void;
}

const useSelectedChannelStore = create<SelectedChannelStore>((set, get) => ({
  selectedChannel: null,

  selectChannel: (channel: ChannelSchema) => {
    set({ selectedChannel: channel });
  },
}));

export default useSelectedChannelStore;
