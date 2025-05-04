import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeChannelMember } from "../../../api/api";
import useUserChannels from "../../../api/hooks/useUserChannels";
import notifications from "../../../utils/notifications";
import { ApiError } from "../../../schemas/common";
import { useCurrentUserId } from "../../../components/CurrentUserProvider";
import Dialog from "../../../components/Dialog";

const LeaveChannelDialogContent = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useUserChannels();
  const currentUserId = useCurrentUserId();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      if (!channelId) return;
      return removeChannelMember(channelId, currentUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
      navigate("/messenger");
    },
    onError: (err) => {
      if (err instanceof ApiError && err.message) {
        notifications.error(err.message);
      }
      notifications.error("Something went wrong");
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

  return (
    <Dialog.Content>
      <h2 className="text-xl font-bold mb-4 text-center">Leaving channel</h2>
      <p className="mb-6 text-center">
        Are you sure you want to leave{" "}
        <span className="font-semibold">{channel.name}</span> channel?
      </p>
      <div className="space-x-2 flex justify-end">
        <Dialog.Close>
          <Button variant={"secondary"}>Cancel</Button>
        </Dialog.Close>
        <Button type="submit" value={"primary"} onClick={() => mutate()}>
          {isPending ? "Leaving..." : "Leave"}
        </Button>
      </div>
    </Dialog.Content>
  );
};

export default LeaveChannelDialogContent;
