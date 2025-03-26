import { AttachmentSchema } from "../../../../schemas/message";
import { File, Music } from "lucide-react";

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const MessageAttachmentFileCard = ({
  attachment,
  isAudio = false,
}: {
  attachment: AttachmentSchema;
  isAudio?: boolean;
}) => {
  const handleClick = () => {
    window.open(attachment.url, "_blank");
  };

  const renderPreview = () => {
    if (attachment.contentType.startsWith("image/")) {
      return (
        <img
          src={attachment.url}
          alt={attachment.filename}
          className="w-10 h-10 rounded-md object-cover"
        />
      );
    }

    return isAudio ? (
      <Music className="w-8 h-8 text-[#9147ff]" />
    ) : (
      <File className="w-8 h-8 text-[#9147ff]" />
    );
  };

  return (
    <div
      className="flex gap-2 items-center w-full px-3 py-2 rounded-lg bg-[#2a2a2e] hover:bg-opacity-90 cursor-pointer transition"
      onClick={handleClick}
    >
      {renderPreview()}
      <div className="flex flex-col">
        <div className="text-[#efeff1] text-sm font-medium truncate">
          {attachment.filename}
        </div>
        <div className="opacity-70 text-xs">
          {formatFileSize(attachment.size)}
        </div>
      </div>
    </div>
  );
};

export default MessageAttachmentFileCard;
