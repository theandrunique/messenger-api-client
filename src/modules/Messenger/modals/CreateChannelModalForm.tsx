import { useLayoutEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import UsersSearchInput from "../components/UsersSearchInput";
import { ChannelSchema } from "../../../schemas/channel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChannel } from "../../../api/api";
import { updateUseUserChannelsOnNewChannel } from "../../../api/hooks/useUserChannels";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import SelectedUser from "../components/SelectedUser";
import { UserPublicSchema } from "../../../schemas/user";

const createChannelSchema = z.object({
  name: z.string().min(1, "Channel name is required").max(50),
  members: z.array(z.string()).min(0),
});

type CreateChannelFormData = z.infer<typeof createChannelSchema>;

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
  const [selectedUsers, setSelectedUsers] = useState<UserPublicSchema[]>(
    []
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateChannelFormData>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: { name: "", members: [] },
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateChannelFormData) =>
      createChannel(data.name, data.members),
    onSuccess: (createdChannel) => {
      updateUseUserChannelsOnNewChannel(queryClient, createdChannel);
      onSubmit(createdChannel);
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
      <div className="w-[400px] text-[#efeff1]">
        <h2 className="text-center text-2xl font-semibold py-5 px-3">
          Create New Channel
        </h2>

        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="flex flex-col px-8 gap-3 pb-3"
        >
          <div className="w-full">
            <div className="text-base font-semibold mb-1">Channel name:</div>
            <Input
              className="w-full"
              {...register("name")}
              placeholder="Enter channel name"
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}
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
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateChannelModalForm;
