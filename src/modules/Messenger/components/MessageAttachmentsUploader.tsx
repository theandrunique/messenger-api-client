import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  DragEvent,
} from "react";
import DropFilesHereMessage from "./ChannelContainer/DropFilesHereMessage";
import { deleteUnusedAttachment, uploadFile } from "../../../api/api";
import { handleCreateAttachments } from "./MessageInputContainer/utils";
import MessageAttachmentInfo from "../types/MessageAttachmentInfo";
import notifications from "../../../utils/notifications";

interface MessageAttachmentsUploaderContextProps {
  onFilesSelect: (files: File[]) => void;
  onMessageAttachmentRemove: (
    messageAttachments: MessageAttachmentInfo
  ) => void;
  messageAttachments: MessageAttachmentInfo[];
  setPendingMessageNonce: (files: File[], nonce: string) => void;
  clearMessageAttachments: (attachments: MessageAttachmentInfo[]) => void;
}

const FileUploaderContext = createContext<
  MessageAttachmentsUploaderContextProps | undefined
>(undefined);

interface MessageAttachmentsUploaderProps extends PropsWithChildren {
  className?: string;
  channelId: string;
}

const MessageAttachmentsUploader = ({
  children,
  className,
  channelId,
}: MessageAttachmentsUploaderProps) => {
  const [messageAttachments, setMessageAttachments] = useState<
    MessageAttachmentInfo[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);

  const updateFileStatus = (
    file: File,
    updates: Partial<Omit<MessageAttachmentInfo, "file">>
  ) => {
    setMessageAttachments((prev) =>
      prev.map((item) => (item.file === file ? { ...item, ...updates } : item))
    );
  };

  const setPendingMessageNonce = (files: File[], nonce: string) => {
    setMessageAttachments((prev) =>
      prev.map((item) =>
        files.includes(item.file) ? { ...item, nonce } : item
      )
    );
  };

  const uploadAttachments = async (files: File[]) => {
    const newAttachments: MessageAttachmentInfo[] = files.map((file) => ({
      file,
      cloudAttachment: null,
      abortController: new AbortController(),
      status: "pending",
    }));

    setMessageAttachments((prev) => [...prev, ...newAttachments]);

    try {
      const response = await handleCreateAttachments(channelId, files);
      response[1].map(([file, errors]) =>
        updateFileStatus(file, { errors, status: "error" })
      );
      const cloudAttachments = response[0];

      await Promise.all(
        cloudAttachments.map(async ([file, cloudAttachment]) => {
          try {
            updateFileStatus(file, { cloudAttachment, status: "uploading" });

            const abortController = newAttachments.find(
              (f) => f.file === file
            )?.abortController;

            if (!abortController) {
              throw new Error(
                "Attachment not found or abort controller is undefined."
              );
            }

            await uploadFile(
              cloudAttachment.uploadUrl,
              file,
              (progress) => {
                updateFileStatus(file, { progress });
              },
              abortController.signal
            );

            updateFileStatus(file, {
              status: "success",
              abortController: undefined,
            });
          } catch (err: any) {
            updateFileStatus(file, { status: "error", errors: [err.message] });
          }
        })
      );
    } catch (err) {
      notifications.error("Error uploading files.");
      console.error("Error uploading files", err);
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

    uploadAttachments(files);
  };

  const onFilesSelect = (files: File[]) => {
    uploadAttachments(files);
  };

  const onMessageAttachmentRemove = (attachment: MessageAttachmentInfo) => {
    if (attachment.abortController) attachment.abortController.abort();
    if (attachment.cloudAttachment) {
      deleteUnusedAttachment(attachment.cloudAttachment?.uploadFilename).catch(
        (err) => console.log(err)
      );
    }
    setMessageAttachments((prev) => prev.filter((f) => f !== attachment));
  };

  const clearMessageAttachments = (attachments: MessageAttachmentInfo[]) => {
    setMessageAttachments((prev) =>
      prev.filter((f) => !attachments.includes(f))
    );
  };

  const value = {
    onFilesSelect,
    messageAttachments,
    onMessageAttachmentRemove,
    setPendingMessageNonce,
    clearMessageAttachments,
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

export default MessageAttachmentsUploader;

export const useMessageAttachmentsUploader = () => {
  const context = useContext(FileUploaderContext);
  if (context === undefined) {
    throw new Error("useFileUploader must be used within a FileUploader");
  }
  return context;
};
