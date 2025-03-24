import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/Modal";
import Avatar from "../../../components/Avatar";
import useUserChannels from "../../../api/hooks/useUserChannels";
import Loading from "../../../components/Loading";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useEffect, useState } from "react";
import { updateChannel } from "../../../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../schemas/common";
import notifications from "../../../utils/notifications";

const editChannelSchema = z.object({
  title: z.string().min(1, "Channel title is required").max(50),
  image: z.string().optional(),
});

type EditChannelFormData = z.infer<typeof editChannelSchema>;

const ManageChannelModal = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { data } = useUserChannels();
  const [initialData, setInitialData] = useState<EditChannelFormData | null>(
    null
  );
  const queryClient = useQueryClient();

  const channel = data?.find((c) => c.id === channelId);
  const onClose = () => navigate(-1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditChannelFormData>({
    resolver: zodResolver(editChannelSchema),
  });

  useEffect(() => {
    if (channel) {
      setInitialData({
        title: channel.title as string,
        image: channel.image || undefined,
      });
      reset({ title: channel.title as string });
    }
  }, [channel, reset]);

  const onSubmit = async (formData: EditChannelFormData) => {
    if (!channelId || !initialData) return;
    console.log("submitting", formData);
    const updates = [];

    if (formData.title !== initialData.title) {
      updates.push(updateChannel(channelId, formData.title));
    }
    if (formData.image !== initialData.image) {
      // TODO: add channel image updating
      updates.push();
    }

    if (updates.length === 0) {
      onClose();
      return;
    }

    try {
      await Promise.all(updates);
      queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
      onClose();
    } catch (error) {
      if (error instanceof ApiError && error.message) {
        notifications.error(error.message);
      } else {
        notifications.error("Something went wrong");
        console.error(error);
      }
    }
  };

  if (!data || !channel)
    return (
      <Modal open={true} onClose={onClose}>
        <Loading message="Loading" />
      </Modal>
    );

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeOnOverlayClick={true}
      closeOnEsc={true}
    >
      <div className="w-[400px] text-[#efeff1]">
        <div className="py-3 px-5 font-semibold text-xl">Edit channel</div>

        <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
          <div className="flex gap-5 items-center px-8 py-3">
            <Avatar
              userId={channel.id}
              avatar={channel.image}
              username={channel.title as string}
              className="w-16 h-16"
            />
            <div className="flex flex-col">
              <div>Channel title</div>
              <Input {...register("title")} />
              {errors.title && <ErrorMessage message={errors.title.message} />}
            </div>
          </div>

          <div className="px-5 pb-5">
            <div className="w-full flex justify-end items-center gap-2">
              <Button
                variant={"secondary"}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting} variant={"primary"}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ManageChannelModal;
