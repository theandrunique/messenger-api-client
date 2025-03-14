import { ReactNode } from "react";
import {
  ChannelMemberSchema,
  ChannelSchema,
  ChannelType,
} from "../../schemas/channel";
import Avatar from "../Avatar";
import useCurrentUser from "../../api/hooks/useCurrentUser";

interface ChannelCardProps {
  channel: ChannelSchema;
  onClick: () => void;
}

const getChannelImage = (
  channel: ChannelSchema,
  member: ChannelMemberSchema | null
) => {
  if (channel.type === ChannelType.PRIVATE) {
    if (member === null) {
      return getFirstLetterImage("S");
    }

    if (member.avatar !== null) {
      return (
        <Avatar
          userId={member.userId}
          avatar={member.avatar}
          username={member.username}
        />
      );
    } else {
      return getFirstLetterImage(member.username);
    }
  } else {
    if (channel.image !== null) {
      return getImageWithSrc(channel.image);
    } else {
      return getFirstLetterImage(channel?.title || "G");
    }
  }
};

const getImageWithSrc = (src: string) => {
  return <img src={src} className="w-full h-full object-cover" />;
};

const getFirstLetterImage = (source: string) => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
      <div className="w-full h-full bg-gray-600 text-white flex items-center justify-center">
        {source[0].toUpperCase()}
      </div>
    </div>
  );
};

const hasUnreadMessages = (channel: ChannelSchema) => {
  return channel.lastMessage && channel.readAt < channel.lastMessage.id;
};

const getChannelName = (
  channel: ChannelSchema,
  otherMember: ChannelMemberSchema | null
) => {
  if (channel.type === ChannelType.PRIVATE) {
    return otherMember
      ? `${otherMember.username} (${otherMember.globalName})`
      : "Saved Messages";
  } else {
    return channel.title || "Unnamed";
  }
};

const ChannelCard = ({ channel, onClick }: ChannelCardProps): ReactNode => {
  const { currentUser } = useCurrentUser();

  const isPrivateChannel = channel.type === ChannelType.PRIVATE;

  const lastMessageText = isPrivateChannel
    ? channel.lastMessage
      ? channel.lastMessage.content
      : ""
    : channel.lastMessage
      ? `${channel.lastMessage.authorUsername}: ${channel.lastMessage.content}`
      : "";

  const lastMessageTime = channel.lastMessage
    ? new Date(channel.lastMessage.timestamp).toLocaleTimeString()
    : "";

  const otherMember = isPrivateChannel
    ? channel.members.find((member) => member.userId !== currentUser?.id) ||
      null
    : null;

  return (
    <div
      onClick={onClick}
      className="flex items-center p-1 rounded-md cursor-pointer hover:bg-[#37373a] transition-colors"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
        {getChannelImage(channel, otherMember)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">
          {getChannelName(channel, otherMember)}
        </div>

        <div className="flex items-center">
          <div className="text-sm text-gray-400 max-w-44 truncate">
            {lastMessageText}
          </div>
          {hasUnreadMessages(channel) && (
            <span className="ml-2 text-xs text-blue-500">●</span>
          )}
          <div></div>
        </div>
      </div>

      <div className="text-xs text-gray-500 ml-4 shrink-0">
        {lastMessageTime}
      </div>
    </div>
  );
};

export default ChannelCard;
