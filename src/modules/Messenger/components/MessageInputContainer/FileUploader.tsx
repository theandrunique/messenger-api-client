import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  DragEvent,
} from "react";
import DropFilesHereMessage from "../ChannelContainer/DropFilesHereMessage";
import { deleteUnusedAttachment, uploadFile } from "../../../../api/api";
import { handleCreateAttachments } from "./utils";
import MessageAttachmentInfo from "../../types/MessageAttachmentInfo";
import notifications from "../../../../utils/notifications";

interface FileUploadContextProps {
  onFilesSelect: (files: File[]) => void;
  onAttachmentRemove: (attachment: MessageAttachmentInfo) => void;
  attachments: MessageAttachmentInfo[];
  clearAttachments: (attachments: MessageAttachmentInfo[]) => void;
}

const FileUploaderContext = createContext<FileUploadContextProps | undefined>(
  undefined
);

interface FileUploaderProps extends PropsWithChildren {
  className?: string;
  channelId: string;
}

const FileUploader = ({
  children,
  className,
  channelId,
}: FileUploaderProps) => {
  const [attachments, setAttachments] = useState<MessageAttachmentInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const updateFileStatus = (
    file: File,
    updates: Partial<Omit<MessageAttachmentInfo, "file">>,
  ) => {
    setAttachments((prev) =>
      prev.map((attachment) =>
        attachment.file === file ? { ...attachment, ...updates } : attachment
      )
    );
  };

  const uploadFiles = async (files: File[]) => {
    const newAttachments: MessageAttachmentInfo[] = files.map((file) => ({
      file,
      cloudAttachment: null,
      status: "pending",
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    try {
      const response = await handleCreateAttachments(channelId, files);
      response[1].map(([file, errors]) => updateFileStatus(file, { errors, status: "error"}));
      const cloudAttachments = response[0];

      await Promise.all(
        cloudAttachments.map(async ([file, cloudAttachment]) => {
          try {
            updateFileStatus(file, { cloudAttachment, status: "uploading" });

            await uploadFile(cloudAttachment.uploadUrl, file, (progress) => {
              updateFileStatus(file, { progress });
            });

            updateFileStatus(file, { status: "success" });
          } catch (err: any) {
            updateFileStatus(file, { status: "error", errors: [err.message] });
          }
        })
      );
    } catch (err) {
      notifications.error("Error uploading files.");
    }
  };

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

    uploadFiles(files);
  };

  const onFilesSelect = (files: File[]) => {
    uploadFiles(files);
  };

  const onAttachmentRemove = (attachment: MessageAttachmentInfo) => {
    if (attachment.cloudAttachment) {
      deleteUnusedAttachment(attachment.cloudAttachment?.uploadFilename).catch(
        (err) => console.log(err)
      );
    }
    setAttachments((prev) => prev.filter((f) => f !== attachment));
  };

  const clearAttachments = (attachments: MessageAttachmentInfo[]) => {
    setAttachments((prev) => prev.filter((f) => !attachments.includes(f)));
  };

  const value = {
    onFilesSelect,
    attachments,
    onAttachmentRemove,
    clearAttachments,
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
