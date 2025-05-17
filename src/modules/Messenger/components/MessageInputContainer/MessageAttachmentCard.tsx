import { FileIcon, X, CircleAlert } from "lucide-react";
import cn from "../../../../utils/cn";
import Button from "../../../../components/ui/Button";
import Spinner from "../../../../components/Spinner";
import Tooltip from "../../../../components/Tooltip";
import { AttachmentSchema } from "../../../../schemas/message";
import { PendingAttachment } from "../AttachmentUploaderProvider";

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const MessageAttachmentCard = ({
  attachment,
  onRemove,
}: {
  attachment: PendingAttachment;
  onRemove: (attachment: PendingAttachment) => void;
}) => {
  const file = attachment.file;
  const status = attachment.status;
  const isImage = file.type.startsWith("image");

  return (
    <div
      key={file.name}
      className={cn(
        `bg-[#1f1f23] ${status === "pending" && "opacity-50"} border border-[#38383f] p-1 px-2 rounded-lg flex flex-col items-center gap-1 relative max-w-36`,
        attachment.status === "error" ? "border-red-500" : "border-[#38383f]"
      )}
    >
      <div className="relative rounded overflow-hidden">
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-24 h-24 object-cover rounded"
          />
        ) : (
          <FileIcon className="w-24 h-24 text-gray-400" />
        )}

        {attachment.status === "uploading" && (
          <div className="absolute inset-0 w-full h-full bg-black/50 flex flex-col items-center justify-center">
            <Spinner />
            <div className="text-xs text-[#efeff1] font-semibold">
              {attachment.progress} %
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 truncate w-full h-full">
        <span className="text-sm text-[#efeff1] truncate">{file.name}</span>
        <span className="text-xs text-gray-400">
          {formatFileSize(file.size)}
        </span>
      </div>

      {attachment.status === "error" && (
        <div className="absolute inset-y-0 right-1 flex items-center justify-center">
          <Tooltip>
            <Tooltip.Trigger>
              <CircleAlert className="w-5 h-5 text-red-500 mr-1" />
            </Tooltip.Trigger>
            <Tooltip.Content>{attachment.errors?.join("\n")}</Tooltip.Content>
          </Tooltip>
        </div>
      )}

      <Button
        className="absolute top-1 right-1 p-1 text-gray-400"
        variant="icon"
        onClick={() => onRemove(attachment)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MessageAttachmentCard;

export const ExistedAttachment = ({
  attachment,
  onRemove,
}: {
  attachment: AttachmentSchema;
  onRemove: () => void;
}) => {
  const isImage = attachment.contentType.startsWith("image");
  
  return (
    <div
      className={cn(
        `bg-[#1f1f23] border border-[#38383f] p-1 px-2 rounded-lg flex flex-col items-center gap-1 relative max-w-36`,
      )}
    >
      <div className="relative rounded overflow-hidden">
        {isImage ? (
          <img
            src={attachment.url}
            alt={attachment.filename}
            className="w-24 h-24 object-cover rounded"
          />
        ) : (
          <FileIcon className="w-24 h-24 text-gray-400" />
        )}
      </div>

      <div className="flex flex-col flex-1 truncate w-full h-full">
        <span className="text-sm text-[#efeff1] truncate">{attachment.filename}</span>
        <span className="text-xs text-gray-400">
          {formatFileSize(attachment.size)}
        </span>
      </div>

      <Button
        className="absolute top-1 right-1 p-1 text-gray-400"
        variant="icon"
        onClick={onRemove}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
