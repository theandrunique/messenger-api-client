import { MessageType } from "./message";
import { UserPublicSchema } from "./user";

export enum ChannelType {
  DM = "DM",
  GROUP_DM = "GROUP_DM",
}

export interface MessageInfoSchema {
  id: string;
  author: UserPublicSchema;
  targetUser: UserPublicSchema | null;
  content: string;
  timestamp: string;
  editedTimestamp: string | null;
  attachmentsCount: number;
  type: MessageType;
  metadata: Record<string, string>;
}

export interface ChannelSchema {
  id: string;
  ownerId: string | null;
  name: string | null;
  image: string | null;
  type: ChannelType;
  lastReadMessageId: string | null;
  maxReadMessageId: string | null;
  lastMessage: MessageInfoSchema | null;
  members: UserPublicSchema[];
}
