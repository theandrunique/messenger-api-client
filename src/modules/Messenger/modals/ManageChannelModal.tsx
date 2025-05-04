import { useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useEffect, useRef, useState } from "react";
import { updateChannel } from "../../../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../schemas/common";
import notifications from "../../../utils/notifications";
import { ImageCropperHandle } from "../../../components/ImageCropper";
import useSmartChannel from "../../../api/hooks/useSmartChannel";
import { Camera } from "lucide-react";
import { Avatar, AvatarImage } from "../../../components/Avatar/Avatar";
import {
  ChannelImage,
  ChannelImageFallback,
} from "../../../components/Avatar/ChannelImage";
import Dialog from "../../../components/Dialog";
import ImageCropperDialogContent from "../../../components/ImageCropperDialogContent";

const editChannelSchema = z.object({
  name: z.string().min(1, "Channel name is required").max(50),
});

type EditChannelFormData = z.infer<typeof editChannelSchema>;

const ManageChannelDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { channelId } = useParams();
  const { data, isPending } = useSmartChannel(channelId);
  const [initialData, setInitialData] = useState<EditChannelFormData | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const cropperRef = useRef<ImageCropperHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditChannelFormData>({
    resolver: zodResolver(editChannelSchema),
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsCropModalOpen(true);
      e.target.value = "";
    }
  };

  const handleCropComplete = async () => {
    if (!cropperRef.current) return;

    try {
      const croppedFile = await cropperRef.current.getCroppedImage();
      if (croppedFile) {
        setCroppedImage(croppedFile);
        setTempImage(URL.createObjectURL(croppedFile));
        setIsCropModalOpen(false);
      }
    } catch (error) {
      notifications.error("Failed to crop image");
      console.error(error);
    }
  };

  const onSubmit = async (data: EditChannelFormData) => {
    if (!channelId || !initialData) return;

    const formData = new FormData();

    if (data.name !== initialData.name) {
      formData.append("name", data.name);
    }
    if (croppedImage) {
      formData.append("image", croppedImage);
    }

    try {
      await updateChannel(channelId, formData);
      queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.message) {
        notifications.error(error.message);
      } else {
        notifications.error("Something went wrong");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!isPending && data) {
      setInitialData({
        name: data.name || "",
      });
      reset({ name: data.name || "" });
    }
  }, [isPending, data]);

  useEffect(() => {
    if (open && data) {
      setInitialData({ name: data.name || "" });
      reset({ name: data.name || "" });

      setCroppedImage(null);
      setTempImage(null);
      setSelectedFile(null);
    }
  }, [open, data]);

  if (!data)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Loading message="Loading" />;
        </Dialog.Content>
      </Dialog>
    );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="px-6"
        >
          <div className="w-[350px] text-[#efeff1]">
            <Dialog.Title>Edit channel</Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              <div className="flex gap-5 items-center justify-start mt-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer relative group w-[4.5rem] h-[4.5rem]"
                >
                  <Avatar className="group-hover:opacity-75 transition-opacity">
                    {tempImage ? (
                      <AvatarImage src={tempImage} />
                    ) : (
                      <ChannelImage channelId={data.id} image={data.image} />
                    )}
                    <ChannelImageFallback name={data.name} />
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="w-10 h-10" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div>Channel name</div>
                  <Input {...register("name")} />
                  {errors.name && (
                    <ErrorMessage message={errors.name.message} />
                  )}
                </div>
              </div>

              <div className="w-full flex justify-end items-center gap-2">
                <Dialog.Close asChild>
                  <Button type="button" variant={"secondary"}>
                    Cancel
                  </Button>
                </Dialog.Close>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant={"primary"}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog>

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <ImageCropperDialogContent
          cropperRef={cropperRef}
          file={selectedFile}
          onCropComplete={handleCropComplete}
        />
      </Dialog>
    </>
  );
};

export default ManageChannelDialog;
