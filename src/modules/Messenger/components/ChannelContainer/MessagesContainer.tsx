import { useEffect, useRef } from "react";
import useMessages from "../../../../api/hooks/useMessages";
import { ChannelSchema } from "../../../../schemas/channel";
import Loading from "../../../../components/Loading";
import MessagesList from "../MessagesList/MessagesList";
import useMessageAck from "./hooks/useMessageAck";

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

  useMessageAck(messages, selectedChannel);

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

  return (
    <div
      ref={containerRef}
      onScroll={handleAutoLoadOnScroll}
      className="messages-container flex-1 p-4 overflow-y-auto bg-[#0e0e10]"
    >
      {isPending ? (
        <PendingMessages />
      ) : (
        <MessagesList
          messages={messages}
          channelType={selectedChannel.type}
          bottomRef={bottomRef}
        />
      )}
    </div>
  );
};

export default MessagesContainer;
