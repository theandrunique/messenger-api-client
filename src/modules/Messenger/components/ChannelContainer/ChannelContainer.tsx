import MessagesContainer from "./MessagesContainer";
import MessageInputContainer from "../MessageInputContainer";
import ChannelContainerHeader from "./ChannelContainerHeader";
import MessageAttachmentsUploader from "../MessageAttachmentsUploader";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../components/Loading";
import SelectChannelMessage from "./SelectChannelMessage";
import useChannel from "../../../../api/hooks/useChannel";

const ChannelContainer = () => {
  const { channelId } = useParams();
  const { data, isPending, isError, error } = useChannel(channelId || null);
  const navigate = useNavigate();

  const openChannelInfoModal = () => {
    navigate("info");
  };

  if (channelId === undefined) return <SelectChannelMessage />;

  if (!data || isPending) return <Loading message="Loading channels" />;

  if (isError) return <Loading message={`Error while loading a channel: ${error}`} />;

  return (
    <div className="flex-1 h-full bg-[#18181b] overflow-hidden">
      <MessageAttachmentsUploader
        className="flex flex-col h-full"
        channelId={channelId}
      >
        <ChannelContainerHeader
          channel={data}
          onClick={openChannelInfoModal}
        />
        <MessagesContainer selectedChannel={data} />
        <MessageInputContainer channelId={channelId} />
      </MessageAttachmentsUploader>

      <Outlet />
    </div>
  );
};

export default ChannelContainer;
