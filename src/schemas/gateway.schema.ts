import { ChannelSchema, ChannelType } from "./channel.schema";
import { MessageSchema } from "./message.schema";

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
