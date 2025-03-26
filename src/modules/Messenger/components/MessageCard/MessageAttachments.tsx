import { AttachmentSchema } from "../../../../schemas/message";
import MessageAttachmentFileCard from "./MessageAttachmentFileCard";
import MediaGrid from "./MessageAttachmentMediaGrid";

const MessageAttachments = ({
  attachments,
}: {
  attachments: AttachmentSchema[];
}) => {
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
    <div className="mb-2 space-y-2">
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
