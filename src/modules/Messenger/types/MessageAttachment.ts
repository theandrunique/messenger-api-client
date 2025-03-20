import { CloudAttachmentResponseSchema } from "../../../schemas/message";

type MessageAttachment = {
  status: "uploading" | "ready" | "error";
  file: File;
  cloudAttachment?: CloudAttachmentResponseSchema;
  id: string;
};

export default MessageAttachment;
