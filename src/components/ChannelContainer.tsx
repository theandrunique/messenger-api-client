import { useEffect } from "react";
import useChannelsStore from "../store/useChannelsStore";
import useMessagesStore from "../store/useMessagesStore";
import { Channel } from "../entities";
import useScrollsState from "../hooks/useScrollsState";

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

  const { currentMessages, isMessagesLoading, loadMessages, hasMore } =
    useMessagesStore();

  const { saveScrollPosition, scrollToSavedPosition, ref } = useScrollsState();

  useEffect(() => {
    if (selectedChannel === null) return;

    saveScrollPosition(selectedChannel.id);
    loadMessages(selectedChannel.id);
  }, [selectedChannel]);

  useEffect(() => {
    if (!selectedChannel || isMessagesLoading || currentMessages.length === 0)
      return;

    scrollToSavedPosition();
  }, [currentMessages, isMessagesLoading]);

  if (!selectedChannel) {
    return <div>Select a channel to start chatting</div>;
  }

  if (isMessagesLoading) return <div>Loading messages...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      <ChannelContainerHeader channel={selectedChannel} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={ref}>
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
