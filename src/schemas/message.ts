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
  avatar: string | null;
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
