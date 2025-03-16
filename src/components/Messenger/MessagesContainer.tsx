import { useRef } from "react";
import useMessages from "../../api/hooks/useMessages";
import { ChannelSchema } from "../../schemas/channel";
import Loading from "../Loading";
import ScrollManager from "../ScrollManager";
import MessagesList from "./MessagesList";

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

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMessagesScroll = (e: React.UIEvent) => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollTrigger = 100;

    if (
      scrollTop < scrollTrigger &&
      hasNextPage &&
      !isFetchingNextPage &&
      containerRef.current
    ) {
      const prevHeight = containerRef.current.scrollHeight;
      const prevScrollTop = containerRef.current.scrollTop;

      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          if (!containerRef.current) return;
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight - prevHeight + prevScrollTop,
          });
        });
      });
    }
  };

  if (isPending)
    return (
      <div className="flex-1">
        <PendingMessages />
      </div>
    );

  return (
    <ScrollManager
      ref={containerRef}
      scrollKey={selectedChannel.id}
      onScroll={handleMessagesScroll}
      className="flex-1 p-4"
    >
      <MessagesList messages={messages} channelType={selectedChannel.type} />
    </ScrollManager>
  );
};

export default MessagesContainer;
