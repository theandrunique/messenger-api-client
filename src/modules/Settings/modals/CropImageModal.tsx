import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Button from "../../../components/ui/Button";
import Cropper, { Area } from "react-easy-crop";
import notifications from "../../../utils/notifications";

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImageSrc(null);
    }
  }, [file]);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [file]);

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const processCroppedImage = async () => {
    if (!croppedAreaPixels || !file) return;

    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(imageBitmap, x, y, width, height, 0, 0, width, height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        notifications.error("Failed to process image.");
        return;
      }

      const croppedAvatar = new File([blob], "avatar.jpg", {
        type: "image/jpeg",
      });

      onSubmit(croppedAvatar);
    }, "image/jpeg");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[600px]">
        <h2 className="text-xl font-semibold text-[#efeff1] text-center p-3">
          Update Profile Picture
        </h2>
        <div className="relative h-[320px] bg-[#0a0a0b]">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false}
              cropShape="round"
              objectFit="contain"
            />
          )}
        </div>

        <div className="flex justify-end p-3">
          <div className="space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={processCroppedImage}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CropImageModal;
