import { useEffect, useRef, useState } from "react";
import { MessageSchema } from "../entities";
import api from "../api/api";

interface UseMessagesProps {
  channelId: string | null;
  before: string | null;
}

const useMessages = ({ channelId, before }: UseMessagesProps) => {
  const messages = useRef<Map<string, MessageSchema[]>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    if (!channelId) return;

    if (channelId !== currentChannelId) {
      setCurrentChannelId(channelId);
      messages.current.set(channelId, []);
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const newMessages = await api.getMessages(channelId, before, limit);

        const totalMessages = [
          ...(messages.current.get(channelId) || []),
          ...newMessages,
        ];

        messages.current.set(channelId, totalMessages);

        setHasMore(!(newMessages.length < limit));
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [channelId, before]);

  return {
    messages: channelId ? messages.current.get(channelId) : [],
    hasMore,
    isLoading,
  };
};

export default useMessages;
