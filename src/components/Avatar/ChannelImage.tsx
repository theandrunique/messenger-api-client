import { AvatarFallback, AvatarImage } from "./Avatar";
import env from "../../env";

interface ChannelImageProps {
  channelId?: string | null;
  image?: string | null;
}

export const ChannelImage = ({ channelId, image }: ChannelImageProps) => {
  const src =
    channelId && image
      ? `${env.IMAGE_ENDPOINT}/channels/${channelId}/images/${image}`
      : undefined;

  return <AvatarImage src={src} />;
};

export const ChannelImageFallback = ({
  name = "Unnamed",
}: {
  name: string | null;
}) => {
  return <AvatarFallback>{name?.[0].toUpperCase()}</AvatarFallback>;
};
