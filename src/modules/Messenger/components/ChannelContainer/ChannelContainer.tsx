import SelectChannelMessage from "./SelectChannelMessage";
import MessagesContainer from "./MessagesContainer";
import useSelectedChannelStore from "../../stores/useSelectedChannelStore";
import ChannelProvider from "../../contexts/ChannelProvider";
import MessageInputContainer from "../MessageInputContainer";
import ChannelContainerHeader from "./ChannelContainerHeader";
import FileUploader from "../MessageInputContainer/FileUploader";

const ChannelContainer = () => {
  const { selectedChannel } = useSelectedChannelStore();

  if (!selectedChannel) {
    return <SelectChannelMessage />;
  }

  return (
    <div
      className="flex-1 bg-[#18181b] overflow-hidden"
    >
      <FileUploader className="flex flex-col h-full" channelId={selectedChannel.id}>
        <ChannelProvider>
          <ChannelContainerHeader channel={selectedChannel} />
          <MessagesContainer selectedChannel={selectedChannel} />
          <MessageInputContainer channelId={selectedChannel.id} />
        </ChannelProvider>
      </FileUploader>
    </div>
  );
};

export default ChannelContainer;
