import { useEffect, useRef } from "react";
import useMessages from "../../../../api/hooks/useMessages";
import { ChannelSchema } from "../../../../schemas/channel";
import Loading from "../../../../components/Loading";
import MessagesList from "../MessagesList/MessagesList";
import useMessageAck from "./hooks/useMessageAck";
import useGatewayEvents from "../../../../gateway/useGatewayEvents";
import { GatewayEventType } from "../../../../gateway/types";

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

  useGatewayEvents({
    [GatewayEventType.MESSAGE_CREATE]: (e) => {
      if (e.message.channelId !== selectedChannel.id) return;
      const container = containerRef.current;
      if (!container || !bottomRef.current) return;

      const scrollToBottomTrigger = 150;
      const scrollLevel = container.scrollHeight - container.scrollTop - container.clientHeight;
      if (scrollLevel > scrollToBottomTrigger) return;

      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    },
  }, [selectedChannel]);

  // Restore scroll position
  useEffect(() => {
    if (selectedChannel && containerRef.current && !isPending) {
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
      onScroll={!isPending ? handleAutoLoadOnScroll : undefined}
      className="messages-container flex-1 px-3 overflow-y-auto bg-[#0e0e10]"
    >
      {isPending ? (
        <Loading message="Loading messages" />
      ) : (
        <MessagesList
          messages={messages}
          channel={selectedChannel}
          bottomRef={bottomRef}
        />
      )}
    </div>
  );
};

export default MessagesContainer;
