import { useEffect } from "react";
import useSelectedChannelStore from "../../store/useSelectedChannelStore";
import useScrollState from "../../hooks/useScrollState";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import { ChannelSchema, ChannelType } from "../../schemas/channel";
import SelectChannelMessage from "./SelectChannelMessage";
import HorizontalDivider from "./HorizontalDivider";
import React from "react";
import { MessageSchema } from "../../schemas/message";
import useCurrentUser from "../../api/hooks/useCurrentUser";
import useMessages from "../../api/hooks/useMessages";

const groupMessagesByAuthor = (
  messages: MessageSchema[]
): MessageSchema[][] => {
  if (messages.length === 0) return [];

  const groups: MessageSchema[][] = [];
  let currentGroup: MessageSchema[] = [messages[0]];
  let currentAuthorId = messages[0].author.id;

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i];
    if (message.author.id === currentAuthorId) {
      currentGroup.push(message);
    } else {
      groups.push(currentGroup);
      currentGroup = [message];
      currentAuthorId = message.author.id;
    }
  }

  groups.push(currentGroup);
  return groups;
};

const MessagesList = ({
  messages,
  channelType,
}: {
  messages: MessageSchema[];
  channelType: ChannelType;
}) => {
  const groupedMessagesByDate = messages.reduce(
    (acc, message) => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);
      return acc;
    },
    {} as Record<string, typeof messages>
  );
  const messageGroupsByDate = Object.entries(groupedMessagesByDate);

  return (
    <>
      {messageGroupsByDate.map(([date, messages]) => {
        const authorGroups = groupMessagesByAuthor(messages);

        return (
          <div key={date} className="relative">
            <HorizontalDivider date={messages[0].timestamp} />
            <div>
              {authorGroups.map((group) =>
                group.map((message, index) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    channelType={channelType}
                    showAvatar={index === group.length - 1}
                    showUsername={index === 0}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

const ChannelContainerHeader = ({ channel }: { channel: ChannelSchema }) => {
  const { currentUser } = useCurrentUser();

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

  if (channel.type === ChannelType.PRIVATE) {
    return (
      <div className="border-b border-[#35353b] p-4">
        <h2 className="text-xl font-bold text-white">
          {getPrivateChannelName()}
        </h2>
      </div>
    );
  } else if (channel.type === ChannelType.GROUP) {
    return (
      <div className="border-b border-[#35353b] px-4 py-2 flex flex-col">
        <h2 className="text-xl font-bold text-white">{channel.title}</h2>
        <h5 className="text-sm text-gray-400">
          {`${channel.members.length} members`}
        </h5>
      </div>
    );
  } else {
    throw new Error(`Unknown channel type ${channel.type}`);
  }
};

const ChannelContainer = () => {
  const selectedChannel = useSelectedChannelStore(
    (store) => store.selectedChannel
  );

  const {
    messages,
    isLoading: isMessagesLoading,
    hasNextPage: hasMoreMessages,
    fetchNextPage: loadOlderMessages,
    isFetchingNextPage: isLoadingOlderMessages,
  } = useMessages(selectedChannel?.id ?? null);

  const {
    saveScrollPosition,
    scrollToLastSavedPositionOrEnd,
    ref: messagesContainerRef,
    scrollToEnd,
    isScrolledToBottom,
  } = useScrollState();

  useEffect(() => {
    if (selectedChannel) saveScrollPosition(selectedChannel.id);
  }, [selectedChannel]);

  useEffect(() => {
    if (isScrolledToBottom()) scrollToEnd();
  }, [messages]);

  useEffect(() => {
    if (!selectedChannel || isMessagesLoading || messages.length === 0)
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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#18181b] overflow-hidden">
      <ChannelContainerHeader channel={selectedChannel} />

      <div
        className="flex-1 overflow-y-auto p-4 bg-[#0e0e10]"
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
      >
        <MessagesList
          messages={messages}
          channelType={selectedChannel.type}
        />
      </div>
      <MessageInput channelId={selectedChannel.id} />
    </div>
  );
};

export default ChannelContainer;
