import MessagesContainer from "./MessagesContainer";
import MessageInputContainer from "../MessageInputContainer";
import ChannelContainerHeader from "./ChannelContainerHeader";
import MessageAttachmentsUploader from "../MessageAttachmentsUploader";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../components/Loading";
import SelectChannelMessage from "./SelectChannelMessage";
import useSmartChannel from "../../../../api/hooks/useSmartChannel";
import useGatewayEvents from "../../../../gateway/useGatewayEvents";
import { GatewayEventType } from "../../../../gateway/types";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";
import ReplyContextProvider from "../ReplyContextProvider";
import EditMessageProvider from "../EditMessageProvider";

const ChannelContainer = () => {
  const { channelId } = useParams();
  const { data, isPending, isError, error } = useSmartChannel(channelId);
  const currentUserId = useCurrentUserId();
  const navigate = useNavigate();

  useGatewayEvents({
    [GatewayEventType.CHANNEL_MEMBER_REMOVE]: (e) => {
      if (e.user.id === currentUserId && e.channelId === channelId) {
        navigate("/messenger");
      }
    },
  }, [channelId, currentUserId]);

  if (channelId === undefined) return <SelectChannelMessage />;

  if (!data || isPending)
    return <Loading message="Loading channel" className="flex-1 h-full" />;

  if (isError)
    return (
      <Loading
        message={`Error while loading a channel(${channelId}): ${error}`}
        className="flex-1 h-full"
      />
    );

  return (
    <div className="flex-1 h-full bg-[#18181b] overflow-hidden">
      <MessageAttachmentsUploader
        className="flex flex-col h-full"
        channelId={channelId}
      >
        <ReplyContextProvider>
          <EditMessageProvider>
            <ChannelContainerHeader channel={data} />
            <MessagesContainer selectedChannel={data} />
            <MessageInputContainer channelId={channelId} />
          </EditMessageProvider>
        </ReplyContextProvider>
      </MessageAttachmentsUploader>

      <Outlet />
    </div>
  );
};

export default ChannelContainer;
