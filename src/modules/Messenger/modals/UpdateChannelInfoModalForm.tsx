import { useLayoutEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import UsersSearchInput from "../components/UsersSearchInput";
import { ChannelSchema } from "../../../schemas/channel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChannel } from "../../../api/api";
import { updateUseUserChannelOnChannelUpdate } from "../../../api/hooks/useUserChannels";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { UserPublicSchema } from "../../../schemas/user";
import SelectedUser from "../components/SelectedUser";
import useSelectedChannelStore from "../stores/useSelectedChannelStore";

const updateChannelInfoSchema = z.object({
  title: z.string().min(1, "Channel name is required").max(50),
  members: z.array(z.string()).min(0),
});

type UpdateChannelInfoFormData = z.infer<typeof updateChannelInfoSchema>;

interface UpdateChannelInfoModalFormProps {
  open: boolean;
  onClose: () => void;
  channel: ChannelSchema;
}

const UpdateChannelInfoModalForm = ({
  open,
  onClose,
  channel,
}: UpdateChannelInfoModalFormProps) => {
  const [selectedUsers, setSelectedUsers] = useState<UserPublicSchema[]>(
    channel.members
  );
  const { selectChannel } = useSelectedChannelStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateChannelInfoFormData>({
    resolver: zodResolver(updateChannelInfoSchema),
    defaultValues: {
      title: channel.title as string,
      members: channel.members.map((member) => member.id),
    },
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateChannelInfoFormData) =>
      updateChannel(channel.id, data.title),
    onSuccess: (updatedChannel) => {
      updateUseUserChannelOnChannelUpdate(queryClient, updatedChannel);
      selectChannel(updatedChannel);
      onClose();
    },
    onError: (err) => {
      setError("root", { message: err.message });
      console.log("Error creating channel: ", err);
    },
  });

  const removeUser = (userToRemove: UserPublicSchema) => {
    setValue(
      "members",
      watch("members").filter((id) => id !== userToRemove.id)
    );
    setSelectedUsers((prev) =>
      prev.filter((user) => user.id !== userToRemove.id)
    );
  };

  const addUser = (user: UserPublicSchema) => {
    setValue("members", [...watch("members"), user.id]);
    setSelectedUsers((prev) => [...prev, user]);
  };

  useLayoutEffect(() => {
    if (open) {
      reset();
      setSelectedUsers([]);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[500px] text-[#efeff1]">
        <h2 className="text-center text-2xl font-semibold p-5">
          Create New Channel
        </h2>

        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="flex flex-col px-16 gap-3 mb-4"
        >
          <div className="w-full">
            <div className="text-base font-semibold mb-1">
              Channel Title: {channel.title !== watch("title") && "*"}
            </div>
            <Input
              className="w-full"
              {...register("title")}
              placeholder="Enter channel name"
            />
            {errors.title && <ErrorMessage message={errors.title.message} />}
          </div>

          <div className="w-full">
            <div className="text-base font-semibold mb-1">Members:</div>
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
              excludeIds={watch("members")}
            />
            {errors.members && (
              <ErrorMessage message={errors.members.message} />
            )}
          </div>

          <div className="w-full flex justify-end items-center mt-3 gap-2">
            {errors.root && <ErrorMessage message={errors.root.message} />}
            <Button variant={"secondary"} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} variant={"primary"}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateChannelInfoModalForm;
