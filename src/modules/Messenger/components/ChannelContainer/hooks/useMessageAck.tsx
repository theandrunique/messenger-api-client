import { useEffect, useRef } from "react";
import { MessageSchema } from "../../../../../schemas/message";
import { postMessageAck } from "../../../../../api/api";
import { ChannelSchema } from "../../../../../schemas/channel";
import useCurrentUser from "../../../../../api/hooks/useCurrentUser";

const useMessageAck = (messages: MessageSchema[], channel: ChannelSchema) => {
  const ackTimeout = useRef<NodeJS.Timeout | null>(null);
  const visibleMessagesRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    const container = document.querySelector(".messages-container");
    if (!container) return;

    const sendAck = (messageId: string) => {
      postMessageAck(channel.id, messageId).catch((err) =>
        console.error(`Failed to send message(${messageId}) ack`, err)
      );
    };
    const shouldSendAck = (messageId: string) => {
      return BigInt(messageId) > BigInt(channel.readAt);
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {

      entries.forEach((entry) => {
        const messageId = entry.target.getAttribute("data-message-id");
        if (!messageId) return;

        if (entry.isIntersecting) {
          visibleMessagesRef.current.add(messageId);
        } else {
          visibleMessagesRef.current.delete(messageId);
        }
      });

      const visibleIds = Array.from(visibleMessagesRef.current);
      if (visibleIds.length === 0) return;

      const maxMessageId = visibleIds.reduce((maxId, currentId) => {
        return BigInt(currentId) > BigInt(maxId) ? currentId : maxId;
      });

      if (!shouldSendAck(maxMessageId)) return;

      if (ackTimeout.current) {
        clearTimeout(ackTimeout.current);
      }

      ackTimeout.current = setTimeout(() => {
        sendAck(maxMessageId);
      }, 300);
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: container,
      threshold: 0.8,
    });

    messages.forEach((message) => {
      if (message.author.id === currentUser?.id) return;
      if (BigInt(message.id) <= BigInt(channel.readAt)) return;

      const newElement = document.querySelector(`[data-message-id="${message.id}"]`);

      if (newElement) {
        observerRef.current?.observe(newElement);
      }
    });

    return () => {
      observerRef.current?.disconnect();
      visibleMessagesRef.current.clear();
    };
  }, [messages, channel]);
};

export default useMessageAck;
