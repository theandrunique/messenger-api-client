import { useContext } from "react";
import env from "../../env";
import { AvatarContext, AvatarFallback, AvatarImage } from "./Avatar";
import { Bookmark } from "lucide-react";

interface UserAvatarProps {
  userId?: string | null;
  avatar?: string | null;
}

export const UserAvatar = ({ userId, avatar }: UserAvatarProps) => {
  const context = useContext(AvatarContext);

  if (!userId || !avatar) context?.setHasError(true);

  const src = `${env.IMAGE_ENDPOINT}/avatars/${userId}/${avatar}`;

  return <AvatarImage src={!userId || !avatar ? undefined : src} />;
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
