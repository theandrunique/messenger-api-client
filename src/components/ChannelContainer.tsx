import { useEffect } from "react";
import useChannelsStore from "../store/useChannelsStore";
import useMessagesStore from "../store/useMessagesStore";

const ChannelContainer = () => {
  const { selectedChannel } = useChannelsStore();

  const { currentMessages, isMessagesLoading, loadMessages, hasMore } =
    useMessagesStore();

  useEffect(() => {
    if (selectedChannel !== null) loadMessages(selectedChannel.id);
  }, [selectedChannel]);

  if (!selectedChannel) {
    return <div>Select a channel to start chatting</div>;
  }

  if (isMessagesLoading) return <div>Loading messages...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-xl font-bold text-white">
          {selectedChannel.title || selectedChannel.members[0].username}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
