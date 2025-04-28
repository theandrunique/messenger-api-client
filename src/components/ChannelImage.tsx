import { HTMLAttributes } from "react";
import cn from "../utils/cn";
import env from "../env";

interface BaseProps extends HTMLAttributes<HTMLDivElement> {}

const Base = ({ children, className }: BaseProps) => {
  return (
    <div
      className={cn(
        "relative shrink-0 flex h-10 w-10 overflow-hidden rounded-full",
        className
      )}
    >
      {children}
    </div>
  );
};

const getFirstLetterImage = (source: string, className?: string) => {
  return (
    <Base className={className}>
      <div className="w-full h-full bg-slate-700 text-[#efeff1] flex items-center justify-center font-semibold shrink-0">
        {source[0].toUpperCase()}
      </div>
    </Base>
  );
};

const getImageWithSrc = (src: string, className?: string) => {
  return (
    <Base className={className}>
      <img src={src} className="w-full h-full aspect-square" />;
    </Base>
  );
};

interface ChannelImageProps extends HTMLAttributes<HTMLDivElement> {
  image: string | null;
  channelId: string;
  channelName: string;
}

const ChannelImage = ({
  image,
  channelId,
  channelName,
  className,
}: ChannelImageProps) => {
  const url = `${env.IMAGE_ENDPOINT}/channels/${channelId}/images/${image}`;

  if (image === null) {
    return getFirstLetterImage(channelName, className);
  } else {
    return getImageWithSrc(url, className);
  }
};

export default ChannelImage;
