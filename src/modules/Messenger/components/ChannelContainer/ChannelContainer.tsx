import MessageInput from "../MessageInput";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import SelectChannelMessage from "./SelectChannelMessage";
import useCurrentUser from "../../../../api/hooks/useCurrentUser";
import MessagesContainer from "./MessagesContainer";
import useSelectedChannelStore from "../../stores/useSelectedChannelStore";
import ChannelProvider from "../../contexts/ChannelProvider";

const ChannelContainerHeader = ({ channel }: { channel: ChannelSchema }) => {
  const { currentUser } = useCurrentUser();

  const getPrivateChannelName = () => {
    const otherMember =
      channel.members.find((member) => member.userId !== currentUser?.id) ||
      null;
    if (otherMember !== null) {
      return `${otherMember.username} (${otherMember.globalName})`;
    } else {
      return "Saved Messages";
    }
  };

  if (channel.type === ChannelType.PRIVATE) {
    return (
      <div className="border-b border-[#35353b] p-4">
        <h2 className="text-xl font-bold text-white">
          {getPrivateChannelName()}
        </h2>
      </div>
    );
  } else if (channel.type === ChannelType.GROUP) {
    return (
      <div className="border-b border-[#35353b] px-4 py-2 flex flex-col">
        <h2 className="text-xl font-bold text-white">{channel.title}</h2>
        <h5 className="text-sm text-gray-400">
          {`${channel.members.length} members`}
        </h5>
      </div>
    );
  } else {
    throw new Error(`Unknown channel type ${channel.type}`);
  }
};

const ChannelContainer = () => {
  const { selectedChannel } = useSelectedChannelStore();

  if (!selectedChannel) {
    return <SelectChannelMessage />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#18181b] overflow-hidden">
      <ChannelProvider>
        <ChannelContainerHeader channel={selectedChannel} />
        <MessagesContainer selectedChannel={selectedChannel} />
        <MessageInput channelId={selectedChannel.id} />
      </ChannelProvider>
    </div>
  );
};

export default ChannelContainer;
