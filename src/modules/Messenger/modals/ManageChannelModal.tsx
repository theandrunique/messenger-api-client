import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/Modal";
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
import ChannelImage from "../../../components/ChannelImage";
import ImageCropper, {
  ImageCropperHandle,
} from "../../../components/ImageCropper";
import useSmartChannel from "../../../api/hooks/useSmartChannel";
import { Camera } from "lucide-react";

const editChannelSchema = z.object({
  name: z.string().min(1, "Channel name is required").max(50),
});

type EditChannelFormData = z.infer<typeof editChannelSchema>;

const ManageChannelModal = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
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

  const onClose = () => navigate(-1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditChannelFormData>({
    resolver: zodResolver(editChannelSchema),
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    setSelectedFile(null);
    URL.revokeObjectURL(tempImage!);
    setTempImage(null);
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

  useEffect(() => {
    if (!isPending && data) {
      setInitialData({
        name: data.name || "",
      });
      reset({ name: data.name || "" });
    }
  }, [isPending, data]);

  if (!data)
    return (
      <Modal open={true} onClose={onClose}>
        <Loading message="Loading" />
      </Modal>
    );

  return (
    <>
      <Modal open={true}>
        <div className="w-[400px] text-[#efeff1]">
          <div className="py-3 px-5 font-semibold text-xl">Edit channel</div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="flex gap-5 items-center px-8 py-3">
              <div
                onClick={handleImageClick}
                className="cursor-pointer relative group"
              >
                {tempImage ? (
                  <img
                    src={tempImage}
                    className="w-[4.5rem] h-[4.5rem] group-hover:opacity-75 transition-opacity rounded-full"
                  />
                ) : (
                  <ChannelImage
                    image={tempImage || data.image}
                    channelId={data.id}
                    channelName={data.name as string}
                    className="w-[4.5rem] h-[4.5rem] group-hover:opacity-75 transition-opacity"
                  />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-10 h-10" />
                </div>
              </div>

              <div className="flex flex-col">
                <div>Channel name</div>
                <Input {...register("name")} />
                {errors.name && <ErrorMessage message={errors.name.message} />}
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant={"primary"}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={isCropModalOpen} onClose={handleCloseCropModal}>
        <div className="w-[600px]">
          <h2 className="text-xl font-semibold text-[#efeff1] text-center p-3">
            Crop Image
          </h2>
          <ImageCropper
            ref={cropperRef}
            file={selectedFile}
            classes={{
              container: "relative h-[320px] bg-[#0a0a0b]",
            }}
          />

          <div className="flex justify-end p-3">
            <div className="space-x-2">
              <Button variant="secondary" onClick={handleCloseCropModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCropComplete}>
                Set Image
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManageChannelModal;
