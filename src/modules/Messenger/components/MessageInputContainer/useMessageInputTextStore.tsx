import { create } from "zustand";

const useMessageInputTextStore = create<{
  content: Record<string, string>;
  set: (channelId: string, content: string) => void;
}>()((set) => ({
  content: {},

  set: (channelId, content) => {
    set((state) => ({
      content: {
        ...state.content,
        [channelId]: content,
      }
    }));
  },
}));

export default useMessageInputTextStore;
