import { FileIcon, X, CircleAlert } from "lucide-react";
import MessageAttachmentInfo from "../../types/MessageAttachmentInfo";
import cn from "../../../../utils/cn";
import { ReactNode } from "react";

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
  const isImage = file.type.startsWith("image");

  return (
    <div
      key={file.name}
      className={cn(
        "bg-[#1f1f23] border border-[#38383f] p-1 rounded-lg flex items-center gap-2 relative w-48",
        attachment.status === "error"
          ? "border-red-500"
          : "border-[#38383f]"
      )}
    >
      <div className="relative">
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <FileIcon className="w-12 h-12 text-gray-400" />
        )}

        {attachment.status === "uploading" && (
          <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center">
            <Spinner className="w-6 h-6 text-[#efeff1]" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 truncate">
        <span className="text-sm text-white truncate">{file.name}</span>
        <span className="text-xs text-gray-400">
          {formatFileSize(file.size)}
        </span>

        {attachment.status === 'uploading' && (
          <div className="h-1 bg-gray-600 rounded-full mt-1">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${attachment.progress}%` }}
            />
          </div>
        )}
      </div>

      {attachment.status === 'error' && (
        <Tooltip content={attachment.errors?.join('\n')}>
          <CircleAlert className="w-5 h-5 text-red-500 mr-1" />
        </Tooltip>
      )}

      <button
        className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600"
        onClick={() => onRemove(attachment)}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FileCard;


const Spinner = ({ className }: { className?: string }) => (
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
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Tooltip = ({ content, children }: { content?: string; children: ReactNode }) => (
  <div className="relative group">
    {children}
    {content && (
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black text-white p-2 rounded text-xs max-w-xs">
        {content}
        <div className="absolute top-full left-2 w-0 h-0 border-4 border-transparent border-t-black" />
      </div>
    )}
  </div>
);
