import { UserPublicSchema } from "./user";

export enum MessageType {
  DEFAULT = "DEFAULT",
  REPLY = "REPLY",
  MEMBER_ADD = "MEMBER_ADD",
  MEMBER_REMOVE = "MEMBER_REMOVE",
  MEMBER_LEAVE = "MEMBER_LEAVE",
  CHANNEL_NAME_CHANGE = "CHANNEL_NAME_CHANGE",
  CHANNEL_IMAGE_CHANGE = "CHANNEL_IMAGE_CHANGE",
  CHANNEL_PINNED_MESSAGE = "CHANNEL_PINNED_MESSAGE",
  CHANNEL_UNPIN_MESSAGE = "CHANNEL_UNPIN_MESSAGE",
  CHANNEL_CREATE = "CHANNEL_CREATE",
  FORWARD = "FORWARD",
}

export interface AttachmentSchema {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
}

export interface MessageSchema {
  type: MessageType;
  id: string;
  channelId: string;
  content: string;
  timestamp: string;
  editedTimestamp: string | null;
  author: UserPublicSchema;
  targetUser: UserPublicSchema | null;
  attachments: AttachmentSchema[];
  referencedMessage: MessageSchema;
  metadata: Record<string, string>;
}

export interface CloudAttachmentsResponseSchema {
  results: CloudAttachmentSchema[];
  errors: CloudAttachmentErrorSchema[];
}

export interface CloudAttachmentSchema {
  id: string | null;
  uploadUrl: string;
  uploadFilename: string;
}

export interface CloudAttachmentErrorSchema {
  id: string | null;
  errors: string[];
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
