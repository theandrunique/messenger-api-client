import { useEffect } from "react";
import useChannelsStore from "../../store/useChannelsStore";
import FullScreenLoading from "../FullScreenLoading";
import ChannelCard from "./ChannelCard";

const ChannelSidebar = () => {
  const { loadChannels, isChannelsLoading, channels, selectChannel } =
    useChannelsStore();

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  if (isChannelsLoading) return <FullScreenLoading />;

  return (
    <div className="h-full w-64 bg-[#1f1f23] flex flex-col overflow-y-auto">
      <div className="flex-1">
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
