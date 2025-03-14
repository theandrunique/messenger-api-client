import Avatar from "../Avatar";
import SimpleCard from "../SimpleCard";
import Button from "../ui/Button";
import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import Cropper, { Area } from "react-easy-crop";
import notifications from "../../utils/notifications";
import { removeAvatar, updateAvatar } from "../../api/api";
import useCurrentUser from "../../api/hooks/useCurrentUser";

interface CropImageModalProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
  onSubmit: () => void;
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

      const croppedFile = new File([blob], "avatar.jpg", {
        type: "image/jpeg",
      });

      try {
        await updateAvatar(croppedFile);
        onClose();
        onSubmit();
      } catch (err) {
        notifications.error("Failed to update profile picture.");
        console.error("Error updating avatar", err);
      }
    }, "image/jpeg");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[600px]">
        <h2 className="text-xl font-semibold text-[#efeff1] text-center mb-3">
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

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4 text-[#efeff1]">
        <h2 className="text-xl font-bold mb-4 text-center">
          Clear Profile Picture
        </h2>
        <p className="mb-6 text-center">
          Are you sure you want to remove your profile picture?
        </p>
        <div className="space-x-2 flex justify-end">
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
          <Button value={"primary"} onClick={onConfirm}>
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const ProfileImageForm = () => {
  const { currentUser, refetch: updateUser } = useCurrentUser();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (currentUser === null) throw new Error("User is not logged in");

  const onClearProfilePicture = async () => {
    try {
      setDeleteModalOpen(false);
      await removeAvatar();
      updateUser();
    } catch (err) {
      notifications.error("Failed to clear profile picture.");
      console.error("Failed to clear profile picture", err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      notifications.error("Invalid file type");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notifications.error("File size exceeds 10MB");
      return;
    }

    setSelectedFile(file);
    setCropModalOpen(true);
  };

  if (!currentUser) return null;

  return (
    <>
      <SimpleCard className="max-w-5xl p-5">
        <div className="flex">
          <div>
            <Avatar
              userId={currentUser.id}
              avatar={currentUser.avatar}
              username={currentUser.username}
              className="w-24 h-24 rounded-full bg-[#374151]"
            />
          </div>

          <div className="ml-4 flex flex-col justify-center items-start space-y-2">
            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputRef}
              onChange={handleFileSelect}
            />

            <div className="space-x-2">
              <Button
                variant={"primary"}
                onClick={() => inputRef.current?.click()}
              >
                {currentUser.avatar
                  ? "Change Profile Picture"
                  : "Add Profile Picture"}
              </Button>
              {currentUser.avatar ? (
                <Button
                  variant={"secondary"}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Clear Profile Picture
                </Button>
              ) : null}
            </div>

            <div className="text-[#efeff1] text-sm">
              Must be JPEG, PNG, WebP or GIF and cannot exceed 10MB.
              <div className="opacity-60">Min recommended size is 512x512.</div>
            </div>
          </div>
        </div>
      </SimpleCard>

      {selectedFile && (
        <CropImageModal
          open={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          file={selectedFile}
          onSubmit={updateUser}
        />
      )}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onClearProfilePicture}
      />
    </>
  );
};

export default ProfileImageForm;
