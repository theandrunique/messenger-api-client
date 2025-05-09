import { AttachmentSchema } from "../../../../schemas/message";
import MediaGrid from "./MediaGrid";
import MessageAttachmentFileCard from "./MessageAttachmentFileCard";

interface MessageAttachmentsProps {
  attachments: AttachmentSchema[];
}

const MessageAttachments = ({ attachments }: MessageAttachmentsProps) => {
  const imagesAndVideos = attachments.filter(
    (a) =>
      a.contentType.startsWith("image/") || a.contentType.startsWith("video/")
  );
  const audios = attachments.filter((a) => a.contentType.startsWith("audio/"));
  const others = attachments.filter(
    (a) =>
      !a.contentType.startsWith("image/") &&
      !a.contentType.startsWith("video/") &&
      !a.contentType.startsWith("audio/")
  );

  return (
    <div className="space-y-2">
      {imagesAndVideos.length > 0 && (
        <MediaGrid attachments={imagesAndVideos} />
      )}
      {audios.map((audio) => (
        <MessageAttachmentFileCard key={audio.id} attachment={audio} isAudio />
      ))}
      {others.map((file) => (
        <MessageAttachmentFileCard key={file.id} attachment={file} />
      ))}
    </div>
  );
};

export default MessageAttachments;
