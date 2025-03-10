import { toast } from "react-toastify";
import api from "../../api/api";
import useAuthStore from "../../store/useAuthStore";
import Avatar from "../Avatar";
import SimpleCard from "../SimpleCard";
import Button from "../ui/Button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../Modal";
import Cropper, { Area } from "react-easy-crop";
import { RotateCw } from "lucide-react";

const ProfileImageForm = () => {
  const currentUser = useAuthStore((store) => store.currentUser);
  const updateUser = useAuthStore((store) => store.updateUser);
  const inputRef = useRef<HTMLInputElement>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const imageUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  if (currentUser === null) throw new Error("User is not logged in");

  const onClearProfilePicture = async () => {
    try {
      setDeleteModalOpen(false);
      await api.removeAvatar();
      updateUser();
    } catch (err) {
      toast.error("Failed to clear profile picture.");
      console.error("Failed to clear profile picture", err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB");
      return;
    }

    setSelectedFile(file);

    setCropModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedFile || !croppedAreaPixels) return;

    const imageBitmap = await createImageBitmap(selectedFile);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const { width, height, x, y } = croppedAreaPixels;
    const rotated = rotation % 180 !== 0;
    const canvasWidth = rotated ? height : width;
    const canvasHeight = rotated ? width : height;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    let drawX = -width / 2;
    let drawY = -height / 2;

    ctx.drawImage(
      imageBitmap,
      x,
      y,
      width,
      height,
      drawX,
      drawY,
      width,
      height
    );

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error("Failed to process image.");
        return;
      }

      const croppedFile = new File([blob], "avatar.jpg", {
        type: "image/jpeg",
      });

      try {
        await api.updateAvatar(croppedFile);
        setCropModalOpen(false);
        updateUser();
      } catch (err) {
        toast.error("Failed to update profile picture.");
        console.error("Error updating avatar", err);
      }
    }, "image/jpeg");
  };

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
              accept="image/jpeg, image/png, image/webp, image/gif"
              hidden
              ref={inputRef}
              onChange={handleFileSelect}
            />

            {currentUser.avatar === null ? (
              <Button
                variant={"primary"}
                onClick={() => inputRef.current?.click()}
              >
                Add Profile Picture
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  variant={"primary"}
                  onClick={() => inputRef.current?.click()}
                >
                  Change Profile Picture
                </Button>
                <Button
                  variant={"icon"}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Clear Profile Picture
                </Button>
              </div>
            )}
            <div className="text-[#efeff1] text-sm">
              Must be JPEG, PNG, WebP or GIF and cannot exceed 10MB.
              <div className="opacity-50">Min recommended size is 512x512.</div>
            </div>
          </div>
        </div>
      </SimpleCard>

      <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
        <div className="w-[600px]">
          <div>
            <h2 className="text-xl font-semibold text-[#efeff1] text-center mb-3">
              Update Profile Picture
            </h2>
          </div>

          <div className="relative h-[320px] bg-[#0a0a0b]">
            {imageUrl && (
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                showGrid={false}
                cropShape="round"
                objectFit="contain"
              />
            )}
          </div>

          <div className="flex justify-end p-3">
            <div className="space-x-2">
              <Button
                variant="secondary"
                onClick={() => setCropModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className=" text-[#efeff1]">
          <h2 className="text-xl font-bold mb-4 text-center">
            Clear Profile Picture
          </h2>
          <p className="mb-6 text-center">
            Are you sure you want to remove your profile picture?
          </p>
          <div className="space-x-2 flex justify-end">
            <Button
              variant={"secondary"}
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button value={"primary"} onClick={onClearProfilePicture}>
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileImageForm;
