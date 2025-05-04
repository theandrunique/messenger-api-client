import SimpleCard from "../../../components/SimpleCard";
import Button from "../../../components/ui/Button";
import React, { useRef, useState } from "react";
import notifications from "../../../utils/notifications";
import { removeAvatar, updateAvatar } from "../../../api/api";
import CropImageModal from "../modals/CropImageModal";
import ConfirmDeleteAvatarDialog from "../modals/ConfirmDeleteAvatarModal";
import { useLoadedCurrentUser } from "../../../components/CurrentUserProvider";
import useCurrentUser from "../../../api/hooks/useCurrentUser";
import { Avatar, AvatarFallback } from "../../../components/Avatar/Avatar";
import { UserAvatar } from "../../../components/Avatar/UserAvatar";
import { Camera } from "lucide-react";

const ProfileImageForm = () => {
  const { refetch: updateUser } = useCurrentUser();
  const currentUser = useLoadedCurrentUser();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const onProfilePictureUpdateSubmit = async (avatar: File) => {
    try {
      await updateAvatar(avatar);
      setCropModalOpen(false);
      updateUser();
    } catch (err) {
      notifications.error("Failed to update profile picture.");
      console.error("Error updating avatar", err);
    }
  };

  return (
    <>
      <SimpleCard className="max-w-5xl p-5">
        <div className="flex">
          <div>
            <Avatar className="w-24 h-24">
              <UserAvatar userId={currentUser.id} avatar={currentUser.avatar} />
              <AvatarFallback>
                <Camera className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
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
          onOpenChange={() => setCropModalOpen(false)}
          file={selectedFile}
          onSubmit={onProfilePictureUpdateSubmit}
        />
      )}
      <ConfirmDeleteAvatarDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={onClearProfilePicture}
      />
    </>
  );
};

export default ProfileImageForm;
