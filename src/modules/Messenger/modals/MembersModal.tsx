import { useParams } from "react-router-dom";
import { UserPublicSchema } from "../../../schemas/user";
import { removeChannelMember } from "../../../api/api";
import notifications from "../../../utils/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../schemas/common";
import Loading from "../../../components/Loading";
import SelectedUser from "../components/SelectedUser";
import Button from "../../../components/ui/Button";
import { useCurrentUserId } from "../../../components/CurrentUserProvider";
import useSmartChannel from "../../../api/hooks/useSmartChannel";
import Dialog from "../../../components/Dialog";
import { useState } from "react";
import AddChannelMembersDialog from "./AddChannelMembersModal";

const MembersDialogContent = () => {
  const { channelId } = useParams();
  const queryClient = useQueryClient();
  const { data, isPending } = useSmartChannel(channelId);
  const currentUserId = useCurrentUserId();

  const [isAddMembersDialogOpen, setIsAddMembersDialogOpen] = useState(false);

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

  if (isPending || !data) return <Loading message="Loading" />;

  return (
    <>
      <Dialog.Content>
        <div className="w-[350px]">
          <Dialog.Title className="mb-3">Members</Dialog.Title>

          <div className="flex flex-col gap-1 mb-5">
            {data.members.map((member) => (
              <SelectedUser
                key={member.id}
                user={member}
                onRemove={
                  currentUserId !== member.id
                    ? () => removeMember(member)
                    : undefined
                }
              />
            ))}
          </div>

          <div className="flex items-center">
            <Button variant="secondary" onClick={() => setIsAddMembersDialogOpen(true)}>Add members</Button>
          </div>
        </div>
      </Dialog.Content>

      <AddChannelMembersDialog open={isAddMembersDialogOpen} onOpenChange={setIsAddMembersDialogOpen} />
    </>
  );
};

export default MembersDialogContent;
