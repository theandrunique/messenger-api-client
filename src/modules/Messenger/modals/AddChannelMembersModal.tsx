import { useNavigate, useParams } from "react-router-dom";
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
import Modal from "../../../components/Modal";
import useSmartChannel from "../../../api/hooks/useSmartChannel";

const AddChannelMembersModal = () => {
  const { channelId } = useParams();
  const [selectedUsers, setSelectedUsers] = useState<UserPublicSchema[]>([]);
  const navigate = useNavigate();
  const { data, isPending } = useSmartChannel(channelId);
  const queryClient = useQueryClient();

  const { mutate, isPending: isPendingMutation } = useMutation({
    mutationFn: () =>
      Promise.all(
        selectedUsers.map((user) => addChannelMember(channelId!, user.id))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
      onClose();
    },
    onError: (err) => {
      if (err instanceof ApiError && err.message) {
        notifications.error(err.message);
      }
      console.log("Error creating channel: ", err);
    },
  });

  const onClose = () => navigate(-1);

  const removeUser = (userToRemove: UserPublicSchema) => {
    setSelectedUsers((prev) =>
      prev.filter((user) => user.id !== userToRemove.id)
    );
  };

  const addUser = (user: UserPublicSchema) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  useLayoutEffect(() => {
    setSelectedUsers([]);
  }, []);

  if (!channelId) {
    console.error("Channel ID not found");
    return;
  }

  if (isPending || !data)
    return (
      <Modal open={true} onClose={onClose}>
        <Loading message="Loading" />
      </Modal>
    );

  return (
    <Modal open={true}>
      <div className="w-[400px] text-[#efeff1]">
        <div className="py-3 px-5 font-semibold text-xl">Add members</div>

        <div className="px-5 pb-3">
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
              excludeIds={data.members.map((member) => member.id)}
            />
          </div>

          <div className="w-full flex justify-end items-center mt-3 gap-2">
            <Button variant={"secondary"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => mutate()}
              disabled={selectedUsers.length === 0 || isPendingMutation}
              variant={"primary"}
            >
              {isPendingMutation ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddChannelMembersModal;
