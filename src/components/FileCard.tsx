import { FileIcon, X } from "lucide-react";
import { CloudAttachmentResponseSchema } from "../entities";

export interface FileInfo {
  cloudAttachment: CloudAttachmentResponseSchema;
  file: File;
};

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const FileCard = ({
  fileInfo,
  onRemove,
}: {
  fileInfo: FileInfo;
  onRemove: (file: FileInfo) => void;
}) => {
  const isImage = fileInfo.file.type.startsWith("image");

  return (
    <div
      key={fileInfo.file.name}
      className="bg-gray-800 p-1 rounded-lg flex items-center gap-2 relative w-48"
    >
      {isImage ? (
        <img
          src={URL.createObjectURL(fileInfo.file)}
          alt={fileInfo.file.name}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <FileIcon className="w-12 h-12 text-gray-400" />
      )}
      <div className="flex flex-col flex-1 truncate">
        <span className="text-sm text-white truncate">
          {fileInfo.file.name}
        </span>
        <span className="text-xs text-gray-400">
          {formatFileSize(fileInfo.file.size)}
        </span>
      </div>
      <button
        className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500"
        onClick={() => onRemove(fileInfo)}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FileCard;
