import { useEffect, useRef } from "react";
import { MessageSchema } from "../../../../../schemas/message";
import { postMessageAck } from "../../../../../api/api";
import { ChannelSchema } from "../../../../../schemas/channel";
import { useCurrentUserId } from "../../../../../components/CurrentUserProvider";
import { compareIds } from "../../../../../utils";

const useMessageAck = (messages: MessageSchema[], channel: ChannelSchema) => {
  const ackTimeout = useRef<NodeJS.Timeout | null>(null);
  const visibleMessagesRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const currentUserId = useCurrentUserId();

  useEffect(() => {
    const container = document.querySelector(".messages-container");
    if (!container) return;

    const sendAck = (messageId: string) => {
      postMessageAck(channel.id, messageId).catch((err) =>
        console.error(`Failed to send message(${messageId}) ack`, err)
      );
    };
    const shouldSendAck = (messageId: string) => {
      return compareIds(messageId, channel.lastReadMessageId);
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
      if (message.author.id === currentUserId) return;
      if (message.id === channel.lastReadMessageId) return;
      if (compareIds(channel.lastReadMessageId, message.id)) return;

      const newElement = document.querySelector(
        `[data-message-id="${message.id}"]`
      );

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
