import { HTMLAttributes } from "react";
import cn from "../utils/cn";

const getFirstLetterImage = (source: string, className?: string) => {
  return (
    <div className={cn("overflow-hidden rounded-full", className)}>
      <div className="w-full h-full bg-gray-600 text-white flex items-center justify-center">
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
  username: string;
}

const Avatar = ({ avatar, username, className }: AvatarProps) => {
  if (avatar === null) {
    return getFirstLetterImage(username, className);
  } else {
    return getImageWithSrc(avatar, className);
  }
};

export default Avatar;
