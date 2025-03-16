import { useEffect, useLayoutEffect, useRef } from "react";
import useSelectedChannelStore from "../../store/useSelectedChannelStore";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import { ChannelSchema, ChannelType } from "../../schemas/channel";
import SelectChannelMessage from "./SelectChannelMessage";
import HorizontalDivider from "./HorizontalDivider";
import React from "react";
import { MessageSchema } from "../../schemas/message";
import useCurrentUser from "../../api/hooks/useCurrentUser";
import useMessages from "../../api/hooks/useMessages";
import Loading from "../Loading";
import MessagesList from "./MessagesList";

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
  const { selectedChannel, prevSelectedChannel } = useSelectedChannelStore();

  const {
    messages,
    isPending: isMessagesLoading,
    hasNextPage: hasMoreMessages,
    fetchNextPage: loadOlderMessages,
    isFetchingNextPage: isLoadingOlderMessages,
  } = useMessages(selectedChannel?.id ?? null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollState = useRef<Record<string, number>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (
      !container ||
      !selectedChannel ||
      isMessagesLoading ||
      messages.length === 0
    )
      return;

    requestAnimationFrame(() => {
      if (scrollState.current[selectedChannel.id] !== undefined) {
        console.log(
          `Restoring scroll for ${selectedChannel.id} to ${scrollState.current[selectedChannel.id]}`
        );
        container.scroll({
          top: scrollState.current[selectedChannel.id],
          behavior: "instant",
        });
      } else {
        console.log(`Scrolling to bottom for ${selectedChannel.id}`);
        container.scroll({
          top: container.scrollHeight,
          behavior: "instant",
        });
      }
    });
  }, [isMessagesLoading, selectedChannel]);

  useLayoutEffect(() => {
    console.log(
      "prevSelectedChannel has changed",
      prevSelectedChannel,
      containerRef.current
    );
    if (prevSelectedChannel && containerRef.current) {
      console.log(
        `Channel is changing saving prev channel (${prevSelectedChannel.id}) scroll ${containerRef.current.scrollTop}`
      );
      scrollState.current[prevSelectedChannel.id] =
        containerRef.current.scrollTop;
    }
  }, [prevSelectedChannel]);

  const handleMessagesScroll = (e: React.UIEvent) => {
    if (!selectedChannel) return;

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
        requestAnimationFrame(() => {
          if (!containerRef.current) return;
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight - prevHeight + prevScrollTop,
          });
        });
      });
    }
  };

  if (!selectedChannel) {
    return <SelectChannelMessage />;
  }

  if (isMessagesLoading)
    return <Loading message="Loading your messages" className="flex-1" />;

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
