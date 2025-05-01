import { Outlet, useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import SelectedUser from "../components/SelectedUser";
import { UserPlusIcon, Users } from "lucide-react";
import Loading from "../../../components/Loading";
import useChannel from "../../../api/hooks/useChannel";
import { Avatar } from "../../../components/Avatar/Avatar";
import {
  ChannelImage,
  ChannelImageFallback,
} from "../../../components/Avatar/ChannelImage";

const ChannelInfoModal = () => {
  const { channelId } = useParams();
  const { data: channel, isPending, isError } = useChannel(channelId || null);
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  const navigateToAddMembers = () => navigate("add-members");

  if (!channelId) {
    console.error("Channel ID not found");
    return;
  }

  if (isPending || !channel)
    return (
      <Modal open={true} onClose={onClose} closeOnOverlayClick={true}>
        <Loading message="Loading" />
      </Modal>
    );

  if (isError) {
    console.error("Channel not found");
    return;
  }

  return (
    <>
      <Modal
        open={true}
        onClose={onClose}
        closeOnOverlayClick={true}
        closeOnEsc={true}
      >
        <div className="w-[400px] text-[#efeff1]">
          <div className="py-3 px-5 font-semibold text-xl">Channel Info</div>

          <div className="flex gap-5 items-center px-8 py-3">
            <Avatar className="w-16 h-16">
              <ChannelImage channelId={channel.id} image={channel.image} />
              <ChannelImageFallback name={channel.name} />
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className="font-semibold text-xl">{channel.name}</div>
              <div className="text-sm opacity-50">
                {channel.members.length} members
              </div>
            </div>
          </div>

          <div className="px-5 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-5">
                <Users className="opacity-70" />
                <div>{channel.members.length} Members</div>
              </div>

              <Button variant="icon" className="p-1">
                <UserPlusIcon
                  className="opacity-70"
                  onClick={navigateToAddMembers}
                />
              </Button>
            </div>

            <div className="flex flex-col gap-1">
              {channel.members.map((member) => (
                <SelectedUser key={member.id} user={member} />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Outlet />
    </>
  );
};

export default ChannelInfoModal;
