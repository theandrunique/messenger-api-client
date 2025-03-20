import { CloudAttachmentResponseSchema } from "../../../schemas/message";

export type MessageAttachmentStatus =
  | "pending"
  | "uploading"
  | "success"
  | "error";

type MessageAttachmentInfo = {
  file: File;
  cloudAttachment: CloudAttachmentResponseSchema | null;
  status: MessageAttachmentStatus;
  progress?: number;
  errors?: string[];
};

export default MessageAttachmentInfo;
