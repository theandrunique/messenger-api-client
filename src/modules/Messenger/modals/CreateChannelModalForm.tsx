import { useLayoutEffect, useState } from "react";
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
import Dialog from "../../../components/Dialog";

const createChannelSchema = z.object({
  name: z.string().min(1, "Channel name is required").max(50),
  members: z.array(z.string()).min(0),
});

type CreateChannelFormData = z.infer<typeof createChannelSchema>;

interface CreateChannelModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (channel: ChannelSchema) => void;
}

const CreateChannelModalForm = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateChannelModalFormProps) => {
  const [selectedUsers, setSelectedUsers] = useState<UserPublicSchema[]>([]);
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
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <div className="w-[370px]">
          <Dialog.Title className="mb-3 text-center">
            Create new channel
          </Dialog.Title>

          <form
            onSubmit={handleSubmit((data) => mutate(data))}
            className="flex flex-col px-4 gap-3"
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
              <Dialog.Close asChild>
                <Button type="button" variant={"secondary"}>Cancel</Button>
              </Dialog.Close>
              <Button type="submit" disabled={isPending} variant={"primary"}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default CreateChannelModalForm;
