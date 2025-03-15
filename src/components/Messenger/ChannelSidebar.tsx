import useSelectedChannelStore from "../../store/useSelectedChannelStore";
import ChannelCard from "./ChannelCard";
import useUserChannels from "../../api/hooks/useUserChannels";
import Loading from "../Loading";

const ChannelSidebar = () => {
  const { isLoading, data: channels } = useUserChannels();

  const { selectChannel } = useSelectedChannelStore();

  if (isLoading) return <Loading message="Loading your channels" className="w-64 bg-[#1f1f23]" />;

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
