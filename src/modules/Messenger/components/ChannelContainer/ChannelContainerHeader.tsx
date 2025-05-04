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
import Dialog from "../../../../components/Dialog";
import LeaveChannelDialogContent from "../../modals/LeaveChannelDialogContent";
import ManageChannelDialog from "../../modals/ManageChannelModal";
import MembersDialogContent from "../../modals/MembersModal";
import ChannelInfoDialog from "../../modals/ChannelInfoModal";

const ChannelMenuButton = () => {
  const [leave, setLeave] = useState(false);
  const [manage, setManage] = useState(false);
  const [members, setMembers] = useState(false);

  const menuButtons = [
    {
      onClick: () => setManage(true),
      icon: Settings2,
      content: "Manage channel",
    },
    {
      onClick: () => setMembers(true),
      icon: Users,
      content: "Members",
    },
    {
      onClick: () => setLeave(true),
      icon: LogOut,
      content: "Leave channel",
    },
  ];

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <DropdownMenu.Trigger asChild>
              <Button variant="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenu.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">Menu</Tooltip.Content>
        </Tooltip>

        <DropdownMenu.Content>
          <div className="flex flex-col">
            {menuButtons.map(({ onClick, icon: Icon, content }) => (
              <DropdownMenu.Button onClick={onClick}>
                <Icon className="w-5 h-5" />
                <div>{content}</div>
              </DropdownMenu.Button>
            ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu>

      <ManageChannelDialog open={manage} onOpenChange={setManage} />

      <Dialog open={members} onOpenChange={setMembers}>
        <MembersDialogContent />
      </Dialog>

      <Dialog open={leave} onOpenChange={setLeave}>
        <LeaveChannelDialogContent />
      </Dialog>
    </>
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
}

const ChannelContainerHeader = ({
  channel,
}: ChannelContainerHeaderProps) => {
  const currentUserId = useCurrentUserId();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
              onClick={() => setIsInfoOpen(true)}
            >
              {getPrivateChannelName()}
            </h2>
          </div>
        </div>

        <UserInfoModal open={isInfoOpen} onOpenChange={setIsInfoOpen} />
      </>
    );
  } else if (channel.type === ChannelType.GROUP_DM) {
    return (
      <>
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
                onClick={() => setIsInfoOpen(true)}
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

        <ChannelInfoDialog open={isInfoOpen} onOpenChange={setIsInfoOpen} />
      </>
    );
  } else {
    throw new Error(`Unknown channel type ${channel.type}`);
  }
};

export default ChannelContainerHeader;
