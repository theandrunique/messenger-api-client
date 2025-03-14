import { create } from "zustand";
import { MessageSchema } from "../schemas/message";
import { getMessages } from "../api/api";

interface MessagesStore {
  currentMessages: MessageSchema[];
  currentChannelId: string | null;
  hasMore: boolean;
  isMessagesLoading: boolean;
  isLoadingOlderMessages: boolean;
  loadMessages: (channelId: string) => Promise<void>;
  loadOlderMessages: () => Promise<void>;
}

const limit = 50;

const useMessagesStore = create<MessagesStore>((set, get) => ({
  currentMessages: [],
  currentChannelId: null,
  hasMore: true,
  isMessagesLoading: false,
  isLoadingOlderMessages: false,

  loadMessages: async (channelId: string) => {
    set({ isMessagesLoading: true, currentChannelId: channelId });
    try {
      const messages = await getMessages(channelId, null, limit.toString());
      messages.reverse();

      set({ hasMore: !(messages.length < limit) });
      set({ currentMessages: messages });
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  loadOlderMessages: async () => {
    const currentChannelId = get().currentChannelId;

    if (currentChannelId === null || !get().hasMore) {
      return;
    }

    set({ isLoadingOlderMessages: true });

    const currentMessages = get().currentMessages;

    const lastMessageId = currentMessages[0].id;

    try {
      const moreMessages = await getMessages(
        currentChannelId,
        lastMessageId,
        limit.toString()
      );
      moreMessages.reverse();

      const totalMessages = [...moreMessages, ...get().currentMessages];

      set({ hasMore: !(moreMessages.length < limit) });

      set({ currentMessages: totalMessages });
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      set({ isLoadingOlderMessages: false });
    }
  },
}));

export default useMessagesStore;
