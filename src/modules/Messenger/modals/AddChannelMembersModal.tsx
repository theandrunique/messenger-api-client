import { useParams } from "react-router-dom";
import SelectedUser from "../components/SelectedUser";
import Loading from "../../../components/Loading";
import { useLayoutEffect, useState } from "react";
import { UserPublicSchema } from "../../../schemas/user";
import UsersSearchInput from "../components/UsersSearchInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/ui/Button";
import { addChannelMember } from "../../../api/api";
import { ApiError } from "../../../schemas/common";
import notifications from "../../../utils/notifications";
import useSmartChannel from "../../../api/hooks/useSmartChannel";
import Dialog from "../../../components/Dialog";

const AddChannelMembersDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { channelId } = useParams();
  const [selectedUsers, setSelectedUsers] = useState<UserPublicSchema[]>([]);
  const { data, isPending } = useSmartChannel(channelId);
  const queryClient = useQueryClient();

  const { mutate, isPending: isPendingMutation } = useMutation({
    mutationFn: () =>
      Promise.all(
        selectedUsers.map((user) => addChannelMember(channelId!, user.id))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
      onOpenChange(false);
    },
    onError: (err) => {
      if (err instanceof ApiError && err.message) {
        notifications.error(err.message);
      }
      console.log("Error creating channel: ", err);
    },
  });

  const removeUser = (userToRemove: UserPublicSchema) => {
    setSelectedUsers((prev) =>
      prev.filter((user) => user.id !== userToRemove.id)
    );
  };

  const addUser = (user: UserPublicSchema) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  useLayoutEffect(() => {
    if (open) {
      setSelectedUsers([]);
    }
  }, [open]);

  if (!channelId) {
    console.error("Channel ID not found");
    return;
  }

  if (isPending || !data)
    return (
      <Dialog>
        <Dialog.Content>
          <Loading message="Loading" />;
        </Dialog.Content>
      </Dialog>
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="w-[350px]">
          <Dialog.Title className="mb-3">Add Members</Dialog.Title>

          <div className="w-full">
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 max-h-32 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <SelectedUser
                    key={user.id}
                    user={user}
                    onRemove={() => removeUser(user)}
                  />
                ))}
              </div>
            )}
            <UsersSearchInput
              onSubmit={(user) => addUser(user)}
              excludeIds={data.members
                .map((member) => member.id)
                .concat(selectedUsers.map((m) => m.id))}
            />
          </div>

          <div className="w-full flex justify-end items-center mt-3 gap-2">
            <Dialog.Close asChild>
              <Button type="button" variant={"secondary"}>
                Cancel
              </Button>
            </Dialog.Close>

            <Button
              onClick={() => mutate()}
              disabled={selectedUsers.length === 0 || isPendingMutation}
              variant={"primary"}
            >
              {isPendingMutation ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddChannelMembersDialog;
