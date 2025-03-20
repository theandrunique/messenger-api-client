import { CloudAttachmentSchema } from "../../../schemas/message";

export type MessageAttachmentStatus =
  | "pending"
  | "uploading"
  | "success"
  | "error";

type MessageAttachmentInfo = {
  file: File;
  cloudAttachment: CloudAttachmentSchema | null;
  abortController?: AbortController;
  status: MessageAttachmentStatus;
  progress?: number;
  errors?: string[];
};

export default MessageAttachmentInfo;
