import { useRef } from "react";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import ImageCropper, {
  ImageCropperHandle,
} from "../../../components/ImageCropper";

interface CropImageModalProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
  onSubmit: (avatar: File) => void;
}

const CropImageModal = ({
  open,
  file,
  onClose,
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
    <Modal open={open} onClose={onClose}>
      <div className="w-[600px]">
        <h2 className="text-xl font-semibold text-[#efeff1] text-center p-3">
          Update Profile Picture
        </h2>
        <ImageCropper
          ref={cropperRef}
          file={file}
          classes={{
            container: "relative h-[320px] bg-[#0a0a0b]",
          }}
        />

        <div className="flex justify-end p-3">
          <div className="space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CropImageModal;
