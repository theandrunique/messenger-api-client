import useCurrentUser from "../../../../api/hooks/useCurrentUser";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";

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

export default ChannelContainerHeader;
