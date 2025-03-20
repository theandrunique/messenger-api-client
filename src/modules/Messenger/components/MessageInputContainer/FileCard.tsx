import { FileIcon, X, CircleAlert } from "lucide-react";
import MessageAttachmentInfo from "../../types/MessageAttachmentInfo";
import cn from "../../../../utils/cn";
import Button from "../../../../components/ui/Button";
import Tooltip from "../../../../components/Tooltip";

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const FileCard = ({
  attachment,
  onRemove,
}: {
  attachment: MessageAttachmentInfo;
  onRemove: (file: MessageAttachmentInfo) => void;
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
          <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center">
            <Spinner
              className="w-16 h-16 text-[#efeff1]"
              progress={attachment.progress}
            />
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
          <Tooltip content={attachment.errors?.join("\n")}>
            <CircleAlert className="w-5 h-5 text-red-500 mr-1" />
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

export default FileCard;

const Spinner = ({
  className,
  progress,
}: {
  className?: string;
  progress?: number;
}) => (
  <div className="relative flex items-center justify-center">
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    {progress !== undefined && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#efeff1]">
        {Math.round(progress)}%
      </div>
    )}
  </div>
);
