import { ReactNode } from "react";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import Avatar from "../../../../components/Avatar";
import { UserPublicSchema } from "../../../../schemas/user";
import { Check, CheckCheck } from "lucide-react";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";

const ReadStatus = ({
  channel,
  currentUserId,
}: {
  channel: ChannelSchema;
  currentUserId?: string;
}) => {
  if (channel.lastMessage?.authorId !== currentUserId) return null;

  return (
    <div className="text-fuchsia-400">
      {channel.maxReadAt === channel.lastMessage.id ? (
        <CheckCheck className="w-4 h-4" />
      ) : (
        <Check className="w-4 h-4" />
      )}
    </div>
  );
};

const FirstLetterImage = ({ letter }: { letter: string }) => (
  <div className="w-full h-full rounded-full overflow-hidden font-semibold bg-slate-700 text-white flex items-center justify-center">
    {letter[0].toUpperCase()}
  </div>
);

interface ChannelImageProps {
  channel: ChannelSchema;
  member: UserPublicSchema | null;
}

const ChannelImage = ({ channel, member }: ChannelImageProps) => {
  if (channel.type === ChannelType.DM) {
    return member?.avatar ? (
      <Avatar
        userId={member.id}
        avatar={member.avatar}
        username={member.username}
        className="w-full h-full"
      />
    ) : (
      <FirstLetterImage letter={member?.username || "S"} />
    );
  }
  return channel.image ? (
    <img src={channel.image} className="w-full h-full object-cover" />
  ) : (
    <FirstLetterImage letter={channel?.title || "G"} />
  );
};

interface ChannelCardProps {
  channel: ChannelSchema;
  isActive: boolean;
  onClick: () => void;
}

const hasUnreadMessages = (channel: ChannelSchema, currentUserId?: string) => {
  if (channel.lastMessage?.authorId === currentUserId) return false;

  return channel.lastMessage && channel.readAt < channel.lastMessage.id;
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
    return channel.title || channel.members.map((m) => m.username).join(", ");
  }
};

const renderLastMessageText = (channel: ChannelSchema) => {
  return channel.type === ChannelType.DM
    ? channel.lastMessage
      ? channel.lastMessage.content
      : ""
    : channel.lastMessage
      ? `${channel.lastMessage.authorUsername}: ${channel.lastMessage.content}`
      : "";
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

      <div className="hidden md:flex flex-col flex-1 min-w-0 mr-1">
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
