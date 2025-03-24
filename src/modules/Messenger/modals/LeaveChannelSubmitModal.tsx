import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveChannel } from "../../../api/api";
import useUserChannels from "../../../api/hooks/useUserChannels";
import notifications from "../../../utils/notifications";
import { ApiError } from "../../../schemas/common";

const LeaveChannelSubmitModal = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useUserChannels();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      if (!channelId) return;
      return leaveChannel(channelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
      navigate("/messenger");
    },
    onError: (err) => {
      if (err instanceof ApiError && err.message) {
        notifications.error(err.message);
      }
      console.log("Error leaving channel: ", err);
    },
  });

  if (!data) return null;
  const channel = data.find((c) => c.id === channelId);
  if (!channel) {
    navigate("/messenger");
    console.error("Channel not found");
    return null;
  }

  const onClose = () => navigate(-1);

  return (
    <Modal open={true} onClose={onClose}>
      <div className="p-4 text-[#efeff1]">
        <h2 className="text-xl font-bold mb-4 text-center">Leaving channel</h2>
        <p className="mb-6 text-center">
          Are you sure you want to leave '{channel.title}' channel?
        </p>
        <div className="space-x-2 flex justify-end">
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
          <Button value={"primary"} onClick={() => mutate()}>
            {isPending ? "Leaving..." : "Leave"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveChannelSubmitModal;
