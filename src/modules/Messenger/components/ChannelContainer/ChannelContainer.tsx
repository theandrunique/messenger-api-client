import SelectChannelMessage from "./SelectChannelMessage";
import MessagesContainer from "./MessagesContainer";
import useSelectedChannelStore from "../../stores/useSelectedChannelStore";
import MessageInputContainer from "../MessageInputContainer";
import ChannelContainerHeader from "./ChannelContainerHeader";
import MessageAttachmentsUploader from "../MessageAttachmentsUploader";

const ChannelContainer = () => {
  const { selectedChannel } = useSelectedChannelStore();

  if (!selectedChannel) {
    return <SelectChannelMessage />;
  }

  return (
    <div className="flex-1 bg-[#18181b] overflow-hidden">
      <MessageAttachmentsUploader
        className="flex flex-col h-full"
        channelId={selectedChannel.id}
      >
        <ChannelContainerHeader channel={selectedChannel} />
        <MessagesContainer selectedChannel={selectedChannel} />
        <MessageInputContainer channelId={selectedChannel.id} />
      </MessageAttachmentsUploader>
    </div>
  );
};

export default ChannelContainer;
