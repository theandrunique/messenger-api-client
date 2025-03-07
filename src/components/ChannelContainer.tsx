import { useEffect } from "react";
import useChannelsStore from "../store/useChannelsStore";
import useMessagesStore from "../store/useMessagesStore";
import useScrollState from "../hooks/useScrollState";
import MessageCard from "./MessageCard";
import useAuthStore from "../store/useAuthStore";
import MessageInput from "./MessageInput";
import { ChannelSchema } from "../schemas/channel.schema";
import SelectChannelMessage from "./SelectChannelMessage";
import HorizontalDivider from "./HorizontalDivider";
import React from "react";

const ChannelContainerHeader = ({ channel }: { channel: ChannelSchema }) => {
  const currentUser = useAuthStore((store) => store.currentUser);

  const getPrivateChannelName = () => {
    const otherMember =
      channel.members.find((member) => member.userId !== currentUser?.id) ||
      null;
    if (otherMember !== null) {
      return `${otherMember.username} (${otherMember.globalName})`;
    } else {
      return "Saved Messages";
    }
  };

  return (
    <div className="border-b border-gray-700 p-4">
      <h2 className="text-xl font-bold text-white">
        {channel.title || getPrivateChannelName()}
      </h2>
    </div>
  );
};

const ChannelContainer = () => {
  const selectedChannel = useChannelsStore((store) => store.selectedChannel);

  const {
    currentMessages,
    isMessagesLoading,
    loadMessages,
    hasMore: hasMoreMessages,
    loadOlderMessages,
    isLoadingOlderMessages,
  } = useMessagesStore();

  const {
    saveScrollPosition,
    scrollToLastSavedPositionOrEnd,
    ref: messagesContainerRef,
    scrollToEnd,
    isScrolledToBottom,
  } = useScrollState();

  useEffect(() => {
    if (selectedChannel === null) return;

    saveScrollPosition(selectedChannel.id);
    loadMessages(selectedChannel.id);
  }, [selectedChannel]);

  useEffect(() => {
    if (isScrolledToBottom()) {
      scrollToEnd();
    }
  }, [currentMessages]);

  useEffect(() => {
    if (!selectedChannel || isMessagesLoading || currentMessages.length === 0)
      return;

    scrollToLastSavedPositionOrEnd();
  }, [isMessagesLoading]);

  const handleMessagesScroll = (e: React.UIEvent) => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollTrigger = 100;

    if (
      scrollTop < scrollTrigger &&
      hasMoreMessages &&
      !isLoadingOlderMessages &&
      messagesContainerRef.current
    ) {
      const prevHeight = messagesContainerRef.current.scrollHeight;
      const prevScrollTop = messagesContainerRef.current.scrollTop;

      loadOlderMessages().then(() => {
        setTimeout(() => {
          if (!messagesContainerRef.current) return;
          messagesContainerRef.current.scrollTo({
            top:
              messagesContainerRef.current.scrollHeight -
              prevHeight +
              prevScrollTop,
          });
        }, 0);
      });
    }
  };

  if (!selectedChannel) {
    return <SelectChannelMessage />;
  }

  if (isMessagesLoading) return <div>Loading messages...</div>;

  const groupedMessages = currentMessages.reduce(
    (acc, message) => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);
      return acc;
    },
    {} as Record<string, typeof currentMessages>
  );

  const messageGroups = Object.entries(groupedMessages);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#18181b] border-l border-gray-700 overflow-hidden">
      <ChannelContainerHeader channel={selectedChannel} />

      <div
        className="flex-1 overflow-y-auto p-4"
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
      >
        {messageGroups.map(([date, messages]) => (
          <div key={date} className="relative">
            <HorizontalDivider date={messages[0].timestamp} />
            <div>
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  channelType={selectedChannel.type}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <MessageInput channelId={selectedChannel.id} />
    </div>
  );
};

export default ChannelContainer;
