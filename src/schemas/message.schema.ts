import { ChannelType } from "./channel.schema";

export interface AttachmentSchema {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: "string";
}

export interface MessageAuthorSchema {
  id: string;
  username: string;
  globalName: string;
  image: string | null;
}

export interface MessageSchema {
  id: string;
  channelId: string;
  content: string;
  timestamp: Date;
  editedTimestamp: Date | null;
  author: MessageAuthorSchema;
  attachments: AttachmentSchema[];
}

export interface CloudAttachmentResponseSchema {
  id: string | null;
  uploadUrl: string;
  uploadFilename: string;
}

export interface CloudAttachmentCreateSchema {
  id: string | null;
  filename: string;
  fileSize: number;
}

export interface MessageAttachmentUploadSchema {
  uploadedFilename: string;
  filename: string;
}
