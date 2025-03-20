import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  DragEvent,
} from "react";
import FileInfo from "../../types/FileInfo";
import DropFilesHereMessage from "../ChannelContainer/DropFilesHereMessage";
import { deleteUnusedAttachment } from "../../../../api/api";
import { uploadFiles } from "./utils";

interface FileUploadContextProps {
  onFilesSelect: (files: File[]) => void;
  onFileRemove: (file: FileInfo) => void;
  fileInfos: FileInfo[];
  clearFileInfos: () => void;
}

const FileUploaderContext = createContext<FileUploadContextProps | undefined>(
  undefined
);

interface FileUploaderProps extends PropsWithChildren {
  className?: string;
  channelId: string;
}

const FileUploader = ({ children, className, channelId }: FileUploaderProps) => {
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    if (
      !e.relatedTarget ||
      !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    uploadFiles(channelId, files)
      .then(newFileInfos => setFileInfos(prev => [...prev, ...newFileInfos]));
  };

  const onFilesSelect = (files: File[]) => {
    uploadFiles(channelId, files)
      .then(newFileInfos => setFileInfos(prev => [...prev, ...newFileInfos]));
  };

  const onFileRemove = (fileInfo: FileInfo) => {
    deleteUnusedAttachment(fileInfo[1].uploadFilename)
      .catch(err => console.log(err));

    setFileInfos(prev => prev.filter(f => f !== fileInfo));
  }

  const clearFileInfos = () => {
    setFileInfos([]);
  }

  const value = {
    onFilesSelect,
    fileInfos,
    onFileRemove,
    clearFileInfos,
  };

  return (
    <FileUploaderContext.Provider value={value}>
      <div className="relative h-full" onDragEnter={handleDragEnter}>
        <div className={className}>{children}</div>
        {isDragging && (
          <div
            className="absolute inset-0 h-full w-full bg-black/60 z-50 backdrop-blur-sm"
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <DropFilesHereMessage />
          </div>
        )}
      </div>
    </FileUploaderContext.Provider>
  );
};

export default FileUploader;

export const useFileUploader = () => {
  const context = useContext(FileUploaderContext);
  if (context === undefined) {
    throw new Error("useFileUploader must be used within a FileUploader");
  }
  return context;
};
