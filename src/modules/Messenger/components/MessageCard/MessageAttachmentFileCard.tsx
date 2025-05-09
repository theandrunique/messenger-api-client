import { AttachmentSchema } from "../../../../schemas/message";
import { File, Play } from "lucide-react";

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
      <Play className="w-5 h-5 text-white" fill="white" />
    ) : (
      <File className="w-5 h-5 text-white" />
    );
  };

  return (
    <div
      className="flex gap-2.5 items-center min-w-48 cursor-pointer"
      onClick={handleClick}
    >
      <div className="rounded-full bg-[#2a2a2e] p-3">
        {renderPreview()}
      </div>
      <div className="flex flex-col overflow-hidden">
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
