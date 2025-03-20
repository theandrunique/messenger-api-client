import { FileIcon, X } from "lucide-react";
import FileInfo from "../../types/FileInfo";

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
  const file = fileInfo[0];
  const isImage = file.type.startsWith("image");

  return (
    <div
      key={file.name}
      className="bg-[#1f1f23] p-1 rounded-lg flex items-center gap-2 relative w-48"
    >
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <FileIcon className="w-12 h-12 text-gray-400" />
      )}
      <div className="flex flex-col flex-1 truncate">
        <span className="text-sm text-white truncate">{file.name}</span>
        <span className="text-xs text-gray-400">
          {formatFileSize(file.size)}
        </span>
      </div>
      <button
        className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600"
        onClick={() => onRemove(fileInfo)}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FileCard;
