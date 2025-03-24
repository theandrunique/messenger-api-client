import { Outlet, useNavigate, useParams } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import SelectedUser from "../components/SelectedUser";
import { UserPlusIcon, Users } from "lucide-react";
import useUserChannels from "../../../api/hooks/useUserChannels";
import Loading from "../../../components/Loading";
import { UserPublicSchema } from "../../../schemas/user";
import { removeChannelMember } from "../../../api/api";
import notifications from "../../../utils/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../schemas/common";

const ChannelInfoModal = () => {
  const { channelId } = useParams();
  const { data, isPending } = useUserChannels();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onClose = () => {
    navigate(-1);
  };

  const navigateToAddMembers = () => {
    navigate("add-members");
  };

  const removeMember = async (member: UserPublicSchema) => {
    try {
      await removeChannelMember(channelId!, member.id);
      notifications.success(`Member ${member.username} removed`);
      queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
    } catch (err) {
      if (err instanceof ApiError && err.message) {
        notifications.error(err.message);
      } else {
        console.error("Unexpected error while removing channel member", err);
      }
    }
  };

  if (!channelId) {
    console.error("Channel ID not found");
    return;
  }

  if (isPending || !data)
    return (
      <Modal open={true} onClose={onClose} closeOnOverlayClick={true}>
        <Loading message="Loading" />
      </Modal>
    );

  const channel = data.find((c) => c.id === channelId);

  if (!channel) {
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
            <Avatar
              userId={channel.id}
              avatar={channel.image}
              username={channel.title as string}
              className="w-16 h-16"
            />
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-xl">{channel.title}</div>
              <div className="text-sm opacity-50">
                {channel.members.length} members
              </div>
            </div>
          </div>

          <div className="px-5">
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

            <div className="flex flex-col gap-1 mb-5">
              {channel.members.map((member) => (
                <SelectedUser
                  key={member.id}
                  user={member}
                  onRemove={() => removeMember(member)}
                />
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
