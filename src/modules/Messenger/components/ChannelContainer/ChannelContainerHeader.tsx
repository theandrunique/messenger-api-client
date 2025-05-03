import { useState } from "react";
import Button from "../../../../components/ui/Button";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import { MoreHorizontal, Settings2, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserInfoModal from "../../modals/UserInfoModal";
import { ArrowLeft } from "lucide-react";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";
import { Avatar } from "../../../../components/Avatar/Avatar";
import {
  SavedMessagesIcon,
  UserAvatar,
  UserAvatarFallback,
} from "../../../../components/Avatar/UserAvatar";
import {
  ChannelImage,
  ChannelImageFallback,
} from "../../../../components/Avatar/ChannelImage";
import Tooltip from "../../../../components/Tooltip";
import DropdownMenu from "../../../../components/DropdownMenu";

const ChannelMenuButton = () => {
  const navigate = useNavigate();

  const menuButtons = [
    {
      onClick: () => navigate("manage-channel"),
      icon: Settings2,
      content: "Manage channel",
    },
    {
      onClick: () => navigate("members"),
      icon: Users,
      content: "Members",
    },
    {
      onClick: () => navigate("leave"),
      icon: LogOut,
      content: "Leave channel",
    },
  ];

  return (
    <DropdownMenu placement="bottom-end">
      <Tooltip placement="bottom">
        <Tooltip.Trigger>
          <DropdownMenu.Trigger>
            <Button variant="icon" className="p-1">
              <MoreHorizontal />
            </Button>
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content>Menu</Tooltip.Content>
      </Tooltip>

      <DropdownMenu.Content className="w-42">
        <div className="flex flex-col p-1 gap-1">
          {menuButtons.map((button, i) => (
            <Button
              key={i}
              variant="icon"
              className="whitespace-nowrap"
              onClick={button.onClick}
            >
              <div className="flex items-center gap-2">
                <button.icon className="w-5 h-5" />
                <div>{button.content}</div>
              </div>
            </Button>
          ))}
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const BackToChannelsButton = () => {
  const navigate = useNavigate();

  return (
    <div className="sm:hidden">
      <Button
        variant="icon"
        onClick={() => navigate("/messenger")}
        className="p-1"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>
    </div>
  );
};

interface ChannelContainerHeaderProps {
  channel: ChannelSchema;
  onClick?: () => void;
}

const ChannelContainerHeader = ({
  channel,
  onClick,
}: ChannelContainerHeaderProps) => {
  const currentUserId = useCurrentUserId();
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);

  const otherMember =
    channel.members.find((member) => member.id !== currentUserId) || null;

  const getPrivateChannelName = () => {
    if (otherMember !== null) {
      return `${otherMember.username} (${otherMember.globalName})`;
    } else {
      return "Saved Messages";
    }
  };

  if (channel.type === ChannelType.DM) {
    return (
      <>
        <div className="border-b border-[#35353b] py-2 px-3 flex items-center justify-start">
          <div className="flex items-center justify-center gap-3">
            <BackToChannelsButton />
            <div className="sm:hidden w-10 h-10">
              {otherMember !== null ? (
                <Avatar>
                  <UserAvatar
                    userId={otherMember.id}
                    avatar={otherMember.avatar}
                  />
                  <UserAvatarFallback username={otherMember.username} />
                </Avatar>
              ) : (
                <Avatar>
                  <SavedMessagesIcon />
                </Avatar>
              )}
            </div>
            <h2
              className="text-xl font-bold text-white cursor-pointer"
              onClick={() => setIsUserInfoModalOpen(true)}
            >
              {getPrivateChannelName()}
            </h2>
          </div>
        </div>
        <UserInfoModal
          open={isUserInfoModalOpen}
          onClose={() => setIsUserInfoModalOpen(false)}
        />
      </>
    );
  } else if (channel.type === ChannelType.GROUP_DM) {
    return (
      <div className="border-b border-[#35353b] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center justify-center gap-3 ">
          <BackToChannelsButton />
          <div className="sm:hidden w-10 h-10">
            <Avatar>
              <ChannelImage channelId={channel.id} image={channel.image} />
              <ChannelImageFallback name={channel.name} />
            </Avatar>
          </div>
          <div className="flex flex-col">
            <h2
              className="text-xl font-bold text-white cursor-pointer"
              onClick={onClick}
            >
              {channel.name}
            </h2>
            <h5 className="text-sm text-gray-400">
              {`${channel.members.length} members`}
            </h5>
          </div>
        </div>

        <ChannelMenuButton />
      </div>
    );
  } else {
    throw new Error(`Unknown channel type ${channel.type}`);
  }
};

export default ChannelContainerHeader;
