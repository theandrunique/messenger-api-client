import { useEffect } from "react";
import useChannelsStore from "../store/useChannelsStore";
import FullScreenLoading from "./FullScreenLoading";
import ChannelCard from "./ChannelCard";

const ChannelSidebar = () => {
  const { loadChannels, isChannelsLoading, channels, selectChannel } =
    useChannelsStore();

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  if (isChannelsLoading) return <FullScreenLoading />;

  return (
    <div className="h-full w-64i bg-gray-800 border-gray-700 border-r flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">Channels</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {channels?.map((channel) => (
          <ChannelCard
            channel={channel}
            key={channel.id}
            onClick={() => selectChannel(channel)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelSidebar;
