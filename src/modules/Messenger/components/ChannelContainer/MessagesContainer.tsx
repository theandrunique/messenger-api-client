import { useCallback, useEffect, useRef } from "react";
import useMessages from "../../../../api/hooks/useMessages";
import { ChannelSchema } from "../../../../schemas/channel";
import Loading from "../../../../components/Loading";
import MessagesList from "../MessagesList/MessagesList";
import { postMessageAck } from "../../../../api/api";

const PendingMessages = () => {
  return <Loading message="Loading messages" />;
};

interface MessagesContainerProps {
  selectedChannel: ChannelSchema;
}

const MessagesContainer = ({ selectedChannel }: MessagesContainerProps) => {
  const {
    messages,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMessages(selectedChannel.id);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionsRef = useRef(new Map<string, number>());

  // scroll to bottom on new messages
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !bottomRef.current) return;

    const scrollToBottomTrigger = 300;
    const scrollLevel =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (scrollLevel < scrollToBottomTrigger) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Restore scroll position
  useEffect(() => {
    if (
      selectedChannel &&
      containerRef.current &&
      !isPending &&
      messages.length !== 0
    ) {
      const scrollPosition = scrollPositionsRef.current.get(selectedChannel.id);

      requestAnimationFrame(() => {
        if (scrollPosition !== undefined) {
          containerRef.current?.scrollTo({
            top: scrollPosition,
            behavior: "instant",
          });
        } else {
          containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "instant",
          });
        }
      });
    }
  }, [selectedChannel.id, isPending]);

  const handleAutoLoadOnScroll = (e: React.UIEvent) => {
    scrollPositionsRef.current.set(
      selectedChannel.id,
      e.currentTarget.scrollTop
    );

    const scrollTrigger = 1000;
    if (
      e.currentTarget.scrollTop < scrollTrigger &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const ackTimeout = useRef<NodeJS.Timeout | null>(null);
  const visibleMessagesRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsMapRef = useRef(new Map<string, HTMLDivElement>());

  const sendAck = useCallback(
    (messageId: string) => {
      postMessageAck(selectedChannel.id, messageId).catch((err) =>
        console.error(`Failed to send message(${messageId}) ack`, err)
      );
    },
    [selectedChannel.id]
  );

  useEffect(() => {
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

      if (ackTimeout.current) {
        clearTimeout(ackTimeout.current);
      }

      ackTimeout.current = setTimeout(() => {
        sendAck(maxMessageId);
      }, 300);
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: containerRef.current,
      threshold: 0.8,
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sendAck]);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    elementsMapRef.current.forEach((el, id) => {
      if (!messages.some((m) => m.id === id)) {
        observer.unobserve(el);
        elementsMapRef.current.delete(id);
      }
    });

    messages.forEach((message) => {
      const element = elementsMapRef.current.get(message.id);
      if (!element) {
        const newElement = document.querySelector(
          `[data-message-id="${message.id}"]`
        );
        if (newElement) {
          elementsMapRef.current.set(message.id, newElement as HTMLDivElement);
          observer.observe(newElement);
        }
      }
    });
  }, [messages]);

  if (isPending)
    return (
      <div className="flex-1 bg-[#0e0e10]">
        <PendingMessages />
      </div>
    );

  return (
    <div
      ref={containerRef}
      onScroll={handleAutoLoadOnScroll}
      className="flex-1 p-4 overflow-y-auto bg-[#0e0e10]"
    >
      <MessagesList
        messages={messages}
        channelType={selectedChannel.type}
        bottomRef={bottomRef}
      />
    </div>
  );
};

export default MessagesContainer;
