import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
    <div className="flex flex-col-reverse">
      {messageGroupsByDate.map(([date, messages]) => {
        const authorGroups = groupMessagesByAuthor(messages);

        return (
          <div key={date}>
            <HorizontalDivider date={messages[0].timestamp} />
            <div className="flex flex-col-reverse">
              {authorGroups.map((group) =>
                group.map((message, index) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    channelType={channelType}
                    showAvatar={index === 0}
                    showUsername={index === group.length - 1}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
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
  const { selectedChannel } = useSelectedChannelStore();

  const {
    messages,
    isLoading: isMessagesLoading,
    hasNextPage: hasMoreMessages,
    fetchNextPage: loadOlderMessages,
    isFetchingNextPage: isLoadingOlderMessages,
  } = useMessages(selectedChannel?.id ?? null);

  const scrollState = useRef<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChannel) {
      console.log(`Current selected channel ${selectedChannel?.id}`);
    }

    return () => {
      if (selectedChannel && containerRef.current) {
        console.log("Selected channel has changed");
        console.log(
          `Saving scroll position for ${selectedChannel.id} ${containerRef.current.scrollTop}`
        );

        scrollState.current[selectedChannel.id] =
          containerRef.current.scrollTop;
      }
    };
  }, [selectedChannel]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !selectedChannel) return;

    if (scrollState.current[selectedChannel.id] !== undefined) {
      console.log(`Scrolling to ${scrollState.current[selectedChannel.id]}`);
      container.scroll({
        top: scrollState.current[selectedChannel.id] - 1,
        behavior: "instant",
      });
    } else {
      console.log("Channel is opened for the first time, scrolling to bottom");
      container.scrollTo({
        top: container.scrollHeight - 1,
        behavior: "instant",
      });
    }
  }, [messages, selectedChannel]);

  const handleMessagesScroll = (e: React.UIEvent) => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollTrigger = 100;

    if (
      scrollTop < scrollTrigger &&
      hasMoreMessages &&
      !isLoadingOlderMessages &&
      containerRef.current
    ) {
      const prevHeight = containerRef.current.scrollHeight;
      const prevScrollTop = containerRef.current.scrollTop;

      loadOlderMessages().then(() => {
        setTimeout(() => {
          if (!containerRef.current) return;
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight - prevHeight + prevScrollTop,
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
        ref={containerRef}
        onScroll={handleMessagesScroll}
      >
        <MessagesList messages={messages} channelType={selectedChannel.type} />
      </div>
      <MessageInput channelId={selectedChannel.id} />
    </div>
  );
};

export default ChannelContainer;
