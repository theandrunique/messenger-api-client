import { HTMLAttributes } from "react";
import cn from "../utils/cn";

const getFirstLetterImage = (source: string, className?: string) => {
  return (
    <div className={cn("overflow-hidden rounded-full", className)}>
      <div className="w-full h-full bg-gray-700 text-white flex items-center justify-center">
        {source[0].toUpperCase()}
      </div>
    </div>
  );
};

const getImageWithSrc = (src: string, className?: string) => {
  return (
    <div className={cn("overflow-hidden rounded-full", className)}>
      <img src={src} className="w-full h-full object-cover" />;
    </div>
  );
};

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  avatar: string | null;
  userId: string;
  username: string;
}

const Avatar = ({ avatar, userId, username, className }: AvatarProps) => {
  const url = `https://cc81154d-55c6-4dfe-8f63-10fb9684572e.selstorage.ru/avatars/${userId}/${avatar}`;

  if (avatar === null) {
    return getFirstLetterImage(username, className);
  } else {
    return getImageWithSrc(url, className);
  }
};

export default Avatar;
