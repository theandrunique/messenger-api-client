import { UserPublicSchema } from "./user";

export enum ChannelType {
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
}

export interface MessageInfoSchema {
  id: string;
  authorId: string;
  authorUsername: string;
  authorGlobalName: string;
  content: string;
  timestamp: Date;
  editedTimestamp: Date | null;
  attachmentsCount: number;
}

export interface ChannelSchema {
  id: string;
  ownerId: string | null;
  title: string | null;
  image: string | null;
  type: ChannelType;
  readAt: string;
  maxReadAt: string | null;
  lastMessageTimestamp: Date | null;
  lastMessage: MessageInfoSchema;
  members: UserPublicSchema[];
}
