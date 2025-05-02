import env from "../../env";
import { AvatarFallback, AvatarImage } from "./Avatar";
import { Bookmark } from "lucide-react";

interface UserAvatarProps {
  userId?: string | null;
  avatar?: string | null;
}

export const UserAvatar = ({ userId, avatar }: UserAvatarProps) => {
  const src =
    userId && avatar
      ? `${env.IMAGE_ENDPOINT}/avatars/${userId}/${avatar}`
      : undefined;

  return <AvatarImage src={src} />;
};

export const UserAvatarFallback = ({ username }: { username: string }) => {
  return <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>;
};

export const SavedMessagesIcon = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Bookmark />
    </div>
  );
};
