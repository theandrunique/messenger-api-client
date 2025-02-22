import { create } from "zustand";
import { MessageSchema } from "../entities";
import api from "../api/api";

interface MessagesStoreState {
  currentMessages: MessageSchema[];
  currentChannelId: string | null;
  hasMore: boolean;
  isMessagesLoading: boolean;
  loadMessages: (channelId: string) => Promise<void>;
}

const limit = 20;

const useMessagesStore = create<MessagesStoreState>((set, get) => ({
  currentMessages: [],
  currentChannelId: null,
  hasMore: true,
  isMessagesLoading: false,

  loadMessages: async (channelId: string) => {
    set({ isMessagesLoading: true, currentChannelId: channelId });
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
  loadMoreMessages: async () => {
    const currentChannelId = get().currentChannelId;

    if (currentChannelId === null || !get().hasMore) {
      return;
    }

    try {
      const moreMessages = await api.getMessages(currentChannelId, null, limit);

      const totalMessages = [...get().currentMessages, ...moreMessages];

      set({ hasMore: !(moreMessages.length < limit) });

      set({ currentMessages: totalMessages });
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  },
}));

export default useMessagesStore;
