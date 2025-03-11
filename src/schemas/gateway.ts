import { ChannelSchema, ChannelType } from "./channel";
import { MessageSchema } from "./message";

interface MessageGatewayEventExtra {
  channelType: ChannelType;
}

export interface MessageCreateEventSchema {
  payload: MessageSchema;
  extra: MessageGatewayEventExtra;
}

export interface ChannelCreateEventSchema {
  payload: ChannelSchema;
}
