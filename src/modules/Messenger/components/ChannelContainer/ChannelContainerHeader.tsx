import { useEffect, useRef, useState } from "react";
import Button from "../../../../components/ui/Button";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import { MoreHorizontal, Settings2, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserInfoModal from "../../modals/UserInfoModal";
import { ArrowLeft } from "lucide-react";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";
import ChannelImage from "../ChannelSidebar/ChannelImage";

const ChannelMenuButton = () => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-[#efeff1]" ref={wrapperRef}>
      <Button
        variant="icon"
        className="p-1"
        onClick={() => setShow((prev) => !prev)}
      >
        <MoreHorizontal />
      </Button>

      {show && (
        <div className="absolute top-full right-[-10px] bg-[#18181b] rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.8)] z-50">
          <div className="flex flex-col p-1 gap-1 w-42">
            <Button
              variant="icon"
              className="whitespace-nowrap"
              onClick={() => navigate("manage-channel")}
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <div>Manage channel</div>
              </div>
            </Button>
            <Button
              variant="icon"
              className="whitespace-nowrap"
              onClick={() => navigate("members")}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <div>Members</div>
              </div>
            </Button>
            <Button
              variant="icon"
              className="whitespace-nowrap"
              onClick={() => navigate("leave")}
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                <div>Leave channel</div>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
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
              <ChannelImage channel={channel} member={otherMember} />
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
            <ChannelImage channel={channel} member={otherMember} />
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
