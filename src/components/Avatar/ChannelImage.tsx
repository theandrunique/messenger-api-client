import { useContext } from "react";
import { AvatarContext, AvatarFallback, AvatarImage } from "./Avatar";
import env from "../../env";

interface ChannelImageProps {
  channelId?: string | null;
  image?: string | null;
}

export const ChannelImage = ({ channelId, image }: ChannelImageProps) => {
  const context = useContext(AvatarContext);

  if (!channelId || !image) context?.setHasError(true);

  const src = `${env.IMAGE_ENDPOINT}/channels/${channelId}/images/${image}`;

  return <AvatarImage src={!channelId || !image ? undefined : src} />;
};

export const ChannelImageFallback = ({
  name = "Unnamed",
}: {
  name: string | null;
}) => {
  return <AvatarFallback>{name?.[0].toUpperCase()}</AvatarFallback>;
};
