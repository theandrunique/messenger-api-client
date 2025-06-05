import { createContext, PropsWithChildren, useContext, useState } from "react";
import { deleteUnusedAttachment, uploadFile } from "../../../api/api";
import { handleCreateAttachments } from "./MessageInputContainer/utils";
import notifications from "../../../utils/notifications";

export type PendingAttachmentStatus =
  | "pending"
  | "uploading"
  | "success"
  | "error";

export interface PendingAttachment {
  file: File;
  channelId: string;
  status: PendingAttachmentStatus;
  messageNonce?: string;
  cloudAttachment?: {
    uploadUrl: string;
    uploadFilename: string;
  };
  abortController?: AbortController;
  progress?: number;
  errors?: string[];
}

const AttachmentsUploaderContext = createContext<
  | {
      upload: (files: File[], channelId: string) => void;
      onRemove: (messageAttachments: PendingAttachment) => void;
      attachments: PendingAttachment[];
      clearAttachments: (channelId: string) => void;
      attach: (attachment: PendingAttachment, messageNonce: string) => void;
    }
  | undefined
>(undefined);

const AttachmentsUploaderProvider = ({ children }: PropsWithChildren) => {
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);

  const updateAttachmentStatus = (
    file: File,
    updates: Partial<Omit<PendingAttachment, "file">>
  ) => {
    setAttachments((prev) =>
      prev.map((item) => (item.file === file ? { ...item, ...updates } : item))
    );
  };

  const uploadAttachments = async (files: File[], channelId: string) => {
    const newAttachments: PendingAttachment[] = files.map((file) => ({
      file,
      channelId,
      abortController: new AbortController(),
      status: "pending",
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    try {
      const response = await handleCreateAttachments(channelId, files);
      response[1].map(([file, errors]) =>
        updateAttachmentStatus(file, { errors, status: "error" })
      );
      const cloudAttachments = response[0];

      await Promise.all(
        cloudAttachments.map(async ([file, cloudAttachment]) => {
          try {
            updateAttachmentStatus(file, {
              cloudAttachment,
              status: "uploading",
            });

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
                updateAttachmentStatus(file, { progress });
              },
              abortController.signal
            );

            updateAttachmentStatus(file, {
              status: "success",
              abortController: undefined,
            });
          } catch (err: any) {
            updateAttachmentStatus(file, {
              status: "error",
              errors: [err.message],
            });
          }
        })
      );
    } catch (err) {
      notifications.error("Error uploading files.");
      console.error("Error uploading files", err);
    }
  };

  const upload = (files: File[], channelId: string) => {
    uploadAttachments(files, channelId);
  };

  const onRemove = (attachment: PendingAttachment) => {
    if (attachment.abortController) attachment.abortController.abort();
    if (attachment.cloudAttachment) {
      deleteUnusedAttachment(attachment.cloudAttachment?.uploadFilename).catch(
        (err) => console.log(err)
      );
    }
    setAttachments((prev) => prev.filter((f) => f !== attachment));
  };

  const clearAttachments = (channelId: string) => {
    setAttachments((prev) => prev.filter((f) => f.channelId !== channelId));
  };

  const attach = (attachment: PendingAttachment, messageNonce: string) => {
    updateAttachmentStatus(attachment.file, { messageNonce })
  }

  return (
    <AttachmentsUploaderContext.Provider value={{
      upload,
      attachments,
      onRemove,
      clearAttachments,
      attach
    }}>
      {children}
    </AttachmentsUploaderContext.Provider>
  );
};

export default AttachmentsUploaderProvider;

export const useAttachmentsUploader = () => {
  const context = useContext(AttachmentsUploaderContext);
  if (context === undefined) {
    throw new Error("useAttachmentsUploader must be used within a AttachmentsUploaderProvider");
  }
  return context;
};
