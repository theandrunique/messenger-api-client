import { ReactNode } from "react";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import { UserPublicSchema } from "../../../../schemas/user";
import { Check, CheckCheck, Users } from "lucide-react";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";
import { isMetaMessage, renderMetaMessageText } from "../MessageCard/utils.tsx";
import { compareIds } from "../../../../utils";
import {
  SavedMessagesIcon,
  UserAvatar,
  UserAvatarFallback,
} from "../../../../components/Avatar/UserAvatar.tsx";
import { Avatar } from "../../../../components/Avatar/Avatar.tsx";
import {
  ChannelImage,
  ChannelImageFallback,
} from "../../../../components/Avatar/ChannelImage.tsx";

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
  if (!channel.lastMessage) return false;

  return compareIds(channel.lastMessage.id, channel.lastReadMessageId);
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
    if (!channel.name) {
      return channel.members.map((m) => m.username).join(", ");
    }
    return channel.name;
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

const ChannelImg = ({
  channel,
  member,
}: {
  channel: ChannelSchema;
  member: UserPublicSchema | null;
}) => {
  if (channel.type === ChannelType.DM) {
    return member !== null ? (
      <Avatar>
        <UserAvatar userId={member.id} avatar={member.avatar} />
        <UserAvatarFallback username={member.username} />
      </Avatar>
    ) : (
      <Avatar>
        <SavedMessagesIcon />
      </Avatar>
    );
  }
  return (
    <Avatar>
      <ChannelImage channelId={channel.id} image={channel.image} />
      <ChannelImageFallback name={channel.name} />
    </Avatar>
  );
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
        <ChannelImg channel={channel} member={otherMember} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 mr-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center font-semibold gap-1 min-w-0">
            {channel.type === ChannelType.GROUP_DM && <Users className="w-4 h-4 shrink-0" />}
            <div className="truncate">
              {renderChannelName(channel, otherMember)}
            </div>
          </div>

          <div className="flex items-center ml-1.5 gap-1 shrink-0">
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
