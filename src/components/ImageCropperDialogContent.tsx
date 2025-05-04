import Dialog from "./Dialog";
import ImageCropper, { ImageCropperHandle } from "./ImageCropper";
import Button from "./ui/Button";

interface ImageCropperDialogContentProps {
  onCropComplete: () => void;
  cropperRef: React.Ref<ImageCropperHandle>;
  file: File | null;
}

const ImageCropperDialogContent = ({ cropperRef, file, onCropComplete }: ImageCropperDialogContentProps) => {
  return (
    <Dialog.Content className="p-0">
      <div className="w-[600px]">
        <Dialog.Title className="text-center my-3">Crop Image</Dialog.Title>
        <ImageCropper
          ref={cropperRef}
          file={file}
          classes={{
            container: "relative h-[320px] bg-[#0a0a0b]",
          }}
        />

        <div className="flex justify-end p-3">
          <div className="space-x-2">
            <Dialog.Close>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Button type="submit" variant="primary" onClick={onCropComplete}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog.Content>
  )
}

export default ImageCropperDialogContent;
