import { ChannelSchema, ChannelType } from "./channel";
import { MessageSchema } from "./message";
import { UserPublicSchema } from "./user";

interface MessageGatewayEventExtra {
  channelType: ChannelType;
}

export interface MessageCreateEventSchema {
  payload: MessageSchema;
  extra: MessageGatewayEventExtra;
}

export interface MessageUpdateEventSchema {
  payload: MessageSchema;
  extra: MessageGatewayEventExtra;
}

export interface ChannelCreateEventSchema {
  payload: ChannelSchema;
}

export interface ChannelUpdateEventSchema {
  payload: ChannelSchema;
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
