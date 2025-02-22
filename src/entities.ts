export enum TerminateSessions {
  WEEK,
  MONTH,
  MONTH3,
  MONTH6,
  YEAR,
}

export type User = {
  id: string;
  username: string;
  globalName: string;
  bio: string | null;
  image: string | null;
  timestamp: Date;
  terminateSessions: TerminateSessions;
  twoFactorAuthentication: boolean;
  email: string;
  isEmailVerified: boolean;
};

export class ServiceError {
  code: string;
  message: string;
  errors?: Record<string, string[]>;

  constructor(
    code: string,
    message: string,
    errors?: Record<string, string[]>
  ) {
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  issuedAt: Date;
};

export enum ChannelType {
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
}

export type MessageInfo = {
  id: string;
  authorId: string;
  authorUsername: string;
  authorGlobalName: string;
  content: string;
  timestamp: Date;
  editedTimestamp: Date | null;
  attachmentsCount: number;
};

export type ChannelMember = {
  userId: string;
  username: string;
  globalName: string;
  image: string | null;
};

export type Channel = {
  id: string;
  ownerId: string | null;
  title: string | null;
  image: string | null;
  type: ChannelType;
  readAt: string;
  lastMessageTimestamp: Date | null;
  lastMessage: MessageInfo;
  members: ChannelMember[];
};

export type Attachment = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: "string";
};

export type MessageAuthor = {
  id: string;
  username: string;
  globalName: string;
  image: string | null;
};

export type MessageSchema = {
  id: string;
  channelId: string;
  content: string;
  timestamp: Date;
  editedTimestamp: Date | null;
  author: MessageAuthor;
  attachments: Attachment[];
};
