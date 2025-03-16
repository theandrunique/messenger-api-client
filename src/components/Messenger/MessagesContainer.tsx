import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import useMessages from "../../api/hooks/useMessages";
import { ChannelSchema } from "../../schemas/channel";
import Loading from "../Loading";
import MessagesList from "./MessagesList";
import useSelectedChannelStore from "../../store/useSelectedChannelStore";

const PendingMessages = () => {
  return <Loading message="Loading messages" />;
};

interface MessagesContainerProps {
  selectedChannel: ChannelSchema;
}

const MessagesContainer = ({ selectedChannel }: MessagesContainerProps) => {
  const { prevSelectedChannel } = useSelectedChannelStore();

  const {
    messages,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMessages(selectedChannel.id);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollPositionsRef = useRef(new Map<string, number>());

  const saveScrollPosition = useCallback(() => {
    if (!prevSelectedChannel || !containerRef.current) return;

    console.log(
      `Saving scroll position for ${prevSelectedChannel.id}: ${containerRef.current.scrollTop}`
    );
    scrollPositionsRef.current.set(
      prevSelectedChannel.id,
      containerRef.current.scrollTop
    );
  }, [prevSelectedChannel]);

  useLayoutEffect(() => {
    saveScrollPosition();
  }, [saveScrollPosition]);

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
    const scrollTrigger = 1000;
    if (
      e.currentTarget.scrollTop < scrollTrigger &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  };

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
      <MessagesList messages={messages} channelType={selectedChannel.type} />
    </div>
  );
};

export default MessagesContainer;
