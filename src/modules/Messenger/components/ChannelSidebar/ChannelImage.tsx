import Avatar from "../../../../components/Avatar";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import { UserPublicSchema } from "../../../../schemas/user";

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

export default ChannelImage;
