import { useEffect, useRef } from "react";
import useChannelsStore from "../store/useChannelsStore";
import useMessagesStore from "../store/useMessagesStore";
import { Channel } from "../entities";

const ChannelContainerHeader = ({ channel }: { channel: Channel }) => {
  return (
    <div className="border-b border-gray-700 p-4">
      <h2 className="text-xl font-bold text-white">
        {channel.title || channel.members[0].username}
      </h2>
    </div>
  );
};

const ChannelContainer = () => {
  const { selectedChannel } = useChannelsStore();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { currentMessages, isMessagesLoading, loadMessages, hasMore } =
    useMessagesStore();

  const scrollsPositions = useRef<Record<string, number>>({});
  const lastChannelId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedChannel === null) return;

    if (lastChannelId.current && messagesContainerRef.current) {
      scrollsPositions.current[lastChannelId.current] =
        messagesContainerRef.current.scrollTop;
    }

    loadMessages(selectedChannel.id);
    lastChannelId.current = selectedChannel.id;
  }, [selectedChannel]);

  useEffect(() => {
    if (!selectedChannel || isMessagesLoading || currentMessages.length === 0)
      return;

    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    requestAnimationFrame(() => {
      const savedPosition = lastChannelId.current
        ? scrollsPositions.current[lastChannelId.current] ||
          messagesContainer.scrollHeight
        : messagesContainer.scrollHeight;

      messagesContainer.scrollTo({ top: savedPosition });
    });
  }, [currentMessages, isMessagesLoading]);

  if (!selectedChannel) {
    return <div>Select a channel to start chatting</div>;
  }

  if (isMessagesLoading) return <div>Loading messages...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      <ChannelContainerHeader channel={selectedChannel} />

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={messagesContainerRef}
      >
        {currentMessages.map((message) => (
          <div key={message.id} className="p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">{message.author.username}</p>
            <p className="text-white">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelContainer;
