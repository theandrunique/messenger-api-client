import { ChannelSchema, ChannelType } from "../schemas/channel";
import { MessageSchema } from "../schemas/message";
import { UserPublicSchema } from "../schemas/user";

export enum GatewayEventType {
  MESSAGE_CREATE = "MESSAGE_CREATE",
  MESSAGE_UPDATE = "MESSAGE_UPDATE",
  CHANNEL_CREATE = "CHANNEL_CREATE",
  CHANNEL_UPDATE = "CHANNEL_UPDATE",
  CHANNEL_MEMBER_ADD = "CHANNEL_MEMBER_ADD",
  CHANNEL_MEMBER_REMOVE = "CHANNEL_MEMBER_REMOVE",
  MESSAGE_ACK = "MESSAGE_ACK",
  MESSAGE_DELETE = "MESSAGE_DELETE",
}

export type GatewayEventSchemas = {
  [GatewayEventType.MESSAGE_CREATE]: MessageCreateEventSchema;
  [GatewayEventType.MESSAGE_UPDATE]: MessageUpdateEventSchema;
  [GatewayEventType.MESSAGE_ACK]: MessageAckEventSchema;
  [GatewayEventType.CHANNEL_CREATE]: ChannelCreateEventSchema;
  [GatewayEventType.CHANNEL_UPDATE]: ChannelUpdateEventSchema;
  [GatewayEventType.CHANNEL_MEMBER_ADD]: ChannelMemberAddEventSchema;
  [GatewayEventType.CHANNEL_MEMBER_REMOVE]: ChannelMemberRemoveEventSchema;
  [GatewayEventType.MESSAGE_DELETE]: MessageDeleteEventSchema;
};

export type GatewayEventHandlers = {
  [K in GatewayEventType]?: (data: GatewayEventSchemas[K]) => void;
};

interface MessageGatewayEventExtra {
  channelType: ChannelType;
}

export interface MessageCreateEventSchema {
  message: MessageSchema;
  extra: MessageGatewayEventExtra;
}

export interface MessageUpdateEventSchema {
  message: MessageSchema;
  extra: MessageGatewayEventExtra;
}

export interface ChannelCreateEventSchema {
  channel: ChannelSchema;
}

export interface ChannelUpdateEventSchema {
  channel: ChannelSchema;
}

export interface ChannelMemberAddEventSchema {
  channelId: string;
  user: UserPublicSchema;
}

export interface ChannelMemberRemoveEventSchema {
  channelId: string;
  user: UserPublicSchema;
}

export interface MessageAckEventSchema {
  messageId: string;
  channelId: string;
  memberId: string;
}

export interface MessageDeleteEventSchema {
  channelId: string;
  messageId: string;
  newLastMessage: MessageSchema;
}
