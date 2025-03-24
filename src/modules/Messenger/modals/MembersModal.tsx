import { Outlet, useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/Modal";
import { UserPublicSchema } from "../../../schemas/user";
import { removeChannelMember } from "../../../api/api";
import notifications from "../../../utils/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../schemas/common";
import Loading from "../../../components/Loading";
import useUserChannels from "../../../api/hooks/useUserChannels";
import SelectedUser from "../components/SelectedUser";
import Button from "../../../components/ui/Button";
import useCurrentUser from "../../../api/hooks/useCurrentUser";

const MembersModal = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isPending } = useUserChannels();
  const { data: currentUser } = useCurrentUser();

  const onClose = () => navigate(-1);

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
        notifications.error("Something went wrong");
        console.error("Unexpected error while removing channel member", err);
      }
    }
  };

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
          <div className="pt-3 px-5 font-semibold text-xl">Members</div>

          <div className="p-5">
            <div className="flex flex-col gap-1 mb-5">
              {channel.members.map((member) => (
                <SelectedUser
                  key={member.id}
                  user={member}
                  onRemove={currentUser?.id !== member.id ? () => removeMember(member) : undefined}
                />
              ))}
            </div>

            <div className="flex items-center">
              <Button variant="secondary" onClick={navigateToAddMembers}>
                Add members
              </Button>
            </div>

          </div>
        </div>
      </Modal>
      <Outlet />
    </>
  );
};

export default MembersModal;
