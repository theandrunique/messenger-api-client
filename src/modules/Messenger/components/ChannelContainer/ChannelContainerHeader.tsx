import { useEffect, useRef, useState } from "react";
import useCurrentUser from "../../../../api/hooks/useCurrentUser";
import Button from "../../../../components/ui/Button";
import { ChannelSchema, ChannelType } from "../../../../schemas/channel";
import { MoreHorizontal, Settings2, LogOut } from "lucide-react";

const ChannelMenuButton = () => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
          <div className="flex flex-col p-1 gap-1 w-40">
            <Button variant="icon" className="whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <div>Manage channel</div>
              </div>
            </Button>
            <Button variant="icon">
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

interface ChannelContainerHeaderProps {
  channel: ChannelSchema;
  onClick?: () => void;
}

const ChannelContainerHeader = ({
  channel,
  onClick,
}: ChannelContainerHeaderProps) => {
  const { currentUser } = useCurrentUser();

  const getPrivateChannelName = () => {
    const otherMember =
      channel.members.find((member) => member.id !== currentUser?.id) || null;
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
      <div className="border-b border-[#35353b] px-4 py-2 flex items-center justify-between">
        <div className="flex flex-col">
          <h2
            className="text-xl font-bold text-white cursor-pointer"
            onClick={onClick}
          >
            {channel.title}
          </h2>
          <h5 className="text-sm text-gray-400">
            {`${channel.members.length} members`}
          </h5>
        </div>

        <ChannelMenuButton />
      </div>
    );
  } else {
    throw new Error(`Unknown channel type ${channel.type}`);
  }
};

export default ChannelContainerHeader;
