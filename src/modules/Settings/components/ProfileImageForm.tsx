import SimpleCard from "../../../components/SimpleCard";
import Button from "../../../components/ui/Button";
import React, { useRef } from "react";
import notifications from "../../../utils/notifications";
import AvatarCropModal, { useAvatarCropModal } from "../modals/AvatarCropModal";
import { useLoadedCurrentUser } from "../../../components/CurrentUserProvider";
import { Avatar, AvatarFallback } from "../../../components/Avatar/Avatar";
import { UserAvatar } from "../../../components/Avatar/UserAvatar";
import { Camera } from "lucide-react";
import AvatarDeleteModal, {
  useAvatarDeleteModal,
} from "../modals/AvatarDeleteModal";

const ProfileImageForm = () => {
  const avatarCropModal = useAvatarCropModal();
  const avatarDeleteModal = useAvatarDeleteModal();

  const currentUser = useLoadedCurrentUser();

  const inputRef = useRef<HTMLInputElement>(null);

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

    avatarCropModal.open(file);
  };

  return (
    <>
      <SimpleCard className="max-w-5xl p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
          <Avatar className="w-24 h-24">
            <UserAvatar userId={currentUser.id} avatar={currentUser.avatar} />
            <AvatarFallback>
              <Camera className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center sm:items-start justify-center gap-2 text-center sm:text-left">
            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputRef}
              onChange={handleFileSelect}
            />

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant={"primary"}
                onClick={() => inputRef.current?.click()}
              >
                {currentUser.avatar
                  ? "Change Profile Picture"
                  : "Add Profile Picture"}
              </Button>
              {currentUser.avatar && (
                <Button variant={"secondary"} onClick={avatarDeleteModal.open}>
                  Clear Profile Picture
                </Button>
              )}
            </div>

            <div className="text-[#efeff1] text-sm">
              Must be JPEG, PNG, WebP or GIF and cannot exceed 10MB.
              <div className="opacity-60">Min recommended size is 512x512.</div>
            </div>
          </div>
        </div>
      </SimpleCard>

      <AvatarCropModal />

      <AvatarDeleteModal />
    </>
  );
};

export default ProfileImageForm;
