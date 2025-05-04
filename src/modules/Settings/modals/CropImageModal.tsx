import { useRef } from "react";
import Button from "../../../components/ui/Button";
import ImageCropper, {
  ImageCropperHandle,
} from "../../../components/ImageCropper";
import Dialog from "../../../components/Dialog";

interface CropImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  onSubmit: (avatar: File) => void;
}

const CropImageModal = ({
  open,
  file,
  onOpenChange,
  onSubmit,
}: CropImageModalProps) => {
  const cropperRef = useRef<ImageCropperHandle>(null);

  const handleSave = async () => {
    if (!cropperRef.current) return;

    const croppedFile = await cropperRef.current.getCroppedImage();
    if (croppedFile) {
      onSubmit(croppedFile);
    } else {
      console.error("Failed to crop image");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="p-0">
        <div className="w-[550px]">
          <Dialog.Title className="text-xl text-center my-3">Update Profile Picture</Dialog.Title>

          <ImageCropper
            ref={cropperRef}
            file={file}
            classes={{
              container: "relative h-[320px] bg-[#0a0a0b]",
            }}
          />

          <div className="flex justify-end p-3">
            <div className="space-x-2">
              <Dialog.Close asChild>
                <Button variant="secondary">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default CropImageModal;
