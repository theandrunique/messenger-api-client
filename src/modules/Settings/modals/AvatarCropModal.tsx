import { useRef } from "react";
import Button from "../../../components/ui/Button";
import ImageCropper, {
  ImageCropperHandle,
} from "../../../components/ImageCropper";
import Dialog from "../../../components/Dialog";
import { useMutation } from "@tanstack/react-query";
import useCurrentUser from "../../../api/hooks/useCurrentUser";
import { updateAvatar } from "../../../api/api";
import { create } from "zustand";

export const useAvatarCropModal = create<{
  open: (avatar: File) => void;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  avatar: File | undefined;
}>()((set) => ({
  isOpen: false,
  avatar: undefined,
  open: (avatar) => {
    set({ isOpen: true, avatar });
  },
  onOpenChange: (open) => {
    set({ isOpen: open });
  },
}));

const AvatarCropModal = () => {
  const modal = useAvatarCropModal();

  const currentUser = useCurrentUser();

  const mutation = useMutation({
    mutationFn: (data: File) => {
      return updateAvatar(data);
    },
    onSuccess: () => {
      modal.onOpenChange(false);
      currentUser.refetch();
    },
  });

  const cropperRef = useRef<ImageCropperHandle>(null);

  const handleSave = async () => {
    if (!cropperRef.current) return;

    const croppedFile = await cropperRef.current.getCroppedImage();
    if (croppedFile) {
      mutation.mutate(croppedFile);
    } else {
      console.error("Failed to crop image");
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onOpenChange}>
      <Dialog.Content className="p-0">
        <div className="w-[550px]">
          <Dialog.Title className="text-xl text-center my-3">
            Update Profile Picture
          </Dialog.Title>

          <ImageCropper
            ref={cropperRef}
            file={modal.avatar!}
            classes={{
              container: "relative h-[320px] bg-[#0a0a0b]",
            }}
          />

          <div className="flex justify-end p-3">
            <div className="space-x-2">
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Button
                disabled={mutation.isPending}
                variant="primary"
                onClick={handleSave}
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default AvatarCropModal;
