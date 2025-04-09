import { ReactNode } from "react";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import { UserPublicSchema } from "../../../../schemas/user";
import { Check, CheckCheck } from "lucide-react";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";
import ChannelImage from "./ChannelImage";
import { isMetaMessage, renderMetaMessageText } from "../MessageCard/utils";

const ReadStatus = ({
  channel,
  currentUserId,
}: {
  channel: ChannelSchema;
  currentUserId?: string;
}) => {
  if (channel.lastMessage?.author.id !== currentUserId) return null;

  return (
    <div className="text-fuchsia-400">
      {channel.maxReadMessageId === channel.lastMessage.id ? (
        <CheckCheck className="w-4 h-4" />
      ) : (
        <Check className="w-4 h-4" />
      )}
    </div>
  );
};

interface ChannelCardProps {
  channel: ChannelSchema;
  isActive: boolean;
  onClick: () => void;
}

const hasUnreadMessages = (channel: ChannelSchema, currentUserId?: string) => {
  if (channel.lastMessage?.author.id === currentUserId) return false;

  return (
    channel.lastMessage && channel.lastReadMessageId < channel.lastMessage.id
  );
};

const renderChannelName = (
  channel: ChannelSchema,
  otherMember: UserPublicSchema | null
) => {
  if (channel.type === ChannelType.DM) {
    return otherMember
      ? `${otherMember.username} (${otherMember.globalName})`
      : "Saved Messages";
  } else {
    return channel.name || channel.members.map((m) => m.username).join(", ");
  }
};

const renderLastMessageText = (channel: ChannelSchema) => {
  if (!channel.lastMessage) return "";

  if (isMetaMessage(channel.lastMessage.type)) {
    return renderMetaMessageText(channel.lastMessage);
  }

  if (channel.type === ChannelType.DM) {
    return channel.lastMessage.content;
  } else if (channel.type === ChannelType.GROUP_DM) {
    return `${channel.lastMessage.author.username}: ${channel.lastMessage.content}`;
  }
};

const renderLastMessageTime = (channel: ChannelSchema) => {
  if (!channel.lastMessage) return "";

  const messageDate = new Date(channel.lastMessage.timestamp);
  const now = new Date();

  const isToday =
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const isThisWeek = messageDate >= startOfWeek;

  return isToday
    ? messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : isThisWeek
      ? messageDate.toLocaleDateString("en-US", { weekday: "short" })
      : messageDate.toLocaleDateString();
};

const ChannelCard = ({
  channel,
  onClick,
  isActive,
}: ChannelCardProps): ReactNode => {
  const currentUserId = useCurrentUserId();

  const isPrivateChannel = channel.type === ChannelType.DM;

  const otherMember = isPrivateChannel
    ? channel.members.find((member) => member.id !== currentUserId) || null
    : null;

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 cursor-pointer ${isActive && "bg-[#35353b]"} hover:bg-[#37373a] text-[#efeff1] gap-3`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <ChannelImage channel={channel} member={otherMember} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 mr-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold truncate">
            {renderChannelName(channel, otherMember)}
          </div>

          <div className="flex items-center gap-1 ml-4 shrink-0">
            <ReadStatus channel={channel} currentUserId={currentUserId} />
            <div className="text-xs opacity-50">
              {renderLastMessageTime(channel)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm opacity-60 truncate">
            {renderLastMessageText(channel)}
          </div>
          <div>
            {hasUnreadMessages(channel, currentUserId) && (
              <div className="rounded-full bg-[#9147ff] w-1.5 h-1.5"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
