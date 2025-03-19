import { useLayoutEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import UsersSearchInput from "../components/UsersSearchInput";
import { UserSearchResultSchema } from "../../../schemas/user";
import { X } from "lucide-react";
import Avatar from "../../../components/Avatar";
import { ChannelSchema } from "../../../schemas/channel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChannel } from "../../../api/api";
import notifications from "../../../utils/notifications";
import { updateUseUserChannelsOnNewChannel } from "../../../api/hooks/useUserChannels";

interface SelectedUserProps {
  user: UserSearchResultSchema;
  onRemove: () => void;
}

const SelectedUser = ({ user, onRemove }: SelectedUserProps) => {
  return (
    <div
      key={user.id}
      className="flex items-center gap-2 bg-[#1f1f23] p-2 rounded-2xl"
    >
      <Avatar
        className="w-8 h-8"
        userId={user.id}
        username={user.username}
        avatar={user.avatar}
      />
      <div className="font-semibold">
        {user.username} ({user.globalName})
      </div>
      <Button
        className="p-1 rounded-lg"
        variant="icon"
        type="button"
        onClick={onRemove}
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

interface CreateChannelModalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (channel: ChannelSchema) => void;
}

const CreateChannelModalForm = ({
  open,
  onClose,
  onSubmit,
}: CreateChannelModalFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { title: string; members: string[] }) =>
      createChannel(data.title, data.members),
    onSuccess: (createdChannel) => {
      updateUseUserChannelsOnNewChannel(queryClient, createdChannel);
      onSubmit(createdChannel);
      onClose();
    },
    onError: (err) => {
      notifications.error(`Failed to create channel. Error: ${err}`);
      console.log("Error creating channel: ", err);
    },
  });

  const [channelName, setChannelName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResultSchema[]>(
    []
  );

  const handleSubmit = () => {
    if (!channelName) {
      notifications.error("Please enter a channel name.");
      return;
    }
    mutate({ title: channelName, members: selectedUsers.map((u) => u.id) });
  };

  const removeUser = (user: UserSearchResultSchema) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  useLayoutEffect(() => {
    if (open) {
      setChannelName("");
      setSelectedUsers([]);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[500px] text-[#efeff1]">
        <h2 className="text-center text-2xl font-semibold p-5">
          Create New Channel
        </h2>

        <div className="flex flex-col px-16 gap-3 mb-4">
          <div className="w-full">
            <div className="text-base font-semibold mb-1">Channel Name:</div>
            <Input
              className="w-full"
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Enter channel name"
            />
          </div>

          <div className="w-full">
            <div className="text-base font-semibold mb-1">Members:</div>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 max-h-32 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <SelectedUser user={user} onRemove={() => removeUser(user)} />
                ))}
              </div>
            )}
            <UsersSearchInput
              onSubmit={(user) => setSelectedUsers([...selectedUsers, user])}
              excludeIds={selectedUsers.map((user) => user.id)}
            />
          </div>

          <div className="w-full flex justify-end items-center mt-3 gap-2">
            <Button variant={"secondary"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              variant={"primary"}
              onClick={handleSubmit}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateChannelModalForm;
