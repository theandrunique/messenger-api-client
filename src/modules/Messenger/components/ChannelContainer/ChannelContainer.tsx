import MessagesContainer from "./MessagesContainer";
import MessageInputContainer from "../MessageInputContainer";
import ChannelContainerHeader from "./ChannelContainerHeader";
import MessageAttachmentsUploader from "../MessageAttachmentsUploader";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../components/Loading";
import useUserChannels from "../../../../api/hooks/useUserChannels";
import SelectChannelMessage from "./SelectChannelMessage";

const ChannelContainer = () => {
  const { channelId } = useParams();
  const { data, isPending } = useUserChannels();
  const navigate = useNavigate();

  const openChannelInfoModal = () => {
    navigate("info");
  };

  if (channelId === undefined) return <SelectChannelMessage />;

  if (!data || isPending) return <Loading message="Loading channels" />;

  const channel = data.find((c) => c.id === channelId);

  if (!channel) return <Loading message={`Channel ${channelId} not found`} />;

  return (
    <div className="flex-1 bg-[#18181b] overflow-hidden">
      <MessageAttachmentsUploader
        className="flex flex-col h-full"
        channelId={channelId}
      >
        <ChannelContainerHeader
          channel={channel}
          onClick={openChannelInfoModal}
        />
        <MessagesContainer selectedChannel={channel} />
        <MessageInputContainer channelId={channelId} />
      </MessageAttachmentsUploader>

      <Outlet />
    </div>
  );
};

export default ChannelContainer;
