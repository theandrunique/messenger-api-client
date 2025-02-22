import { create } from "zustand";
import { MessageSchema } from "../entities";
import api from "../api/api";

interface MessagesStoreState {
  currentMessages: MessageSchema[];
  hasMore: boolean;
  isMessagesLoading: boolean;
  loadMessages: (channelId: string) => Promise<void>;
}

const limit = 10;

const useMessagesStore = create<MessagesStoreState>((set, get) => ({
  currentMessages: [],
  hasMore: true,
  isMessagesLoading: false,

  loadMessages: async (channelId: string) => {
    set({ isMessagesLoading: true });
    try {
      const messages = await api.getMessages(channelId, null, limit);
      set({ hasMore: !(messages.length < limit) });
      set({ currentMessages: messages });
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));

export default useMessagesStore;
