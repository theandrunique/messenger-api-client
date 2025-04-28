import { MessageInfoSchema } from "../../../../schemas/channel";
import { MessageSchema, MessageType } from "../../../../schemas/message";

export const isMetaMessage = (messageType: MessageType): boolean => {
  return (
    messageType !== MessageType.DEFAULT && messageType !== MessageType.REPLY
  );
};

export const renderMetaMessageText = (
  message: MessageSchema | MessageInfoSchema
) => {
  if (message.type === MessageType.MEMBER_ADD) {
    return `${message.author.username} added ${message.targetUser?.username}`;
  } else if (message.type === MessageType.MEMBER_REMOVE) {
    return `${message.author.username} removed ${message.targetUser?.username}`;
  } else if (message.type === MessageType.MEMBER_LEAVE) {
    return `${message.author.username} left the chat`;
  } else if (message.type === MessageType.CHANNEL_NAME_CHANGE) {
    return `${message.author.username} changed channel name to "${message.metadata.newName}"`;
  } else if (message.type === MessageType.CHANNEL_IMAGE_CHANGE) {
    return `${message.author.username} updated channel image`;
  } else if (message.type === MessageType.CHANNEL_PINNED_MESSAGE) {
    return `A message was pinned`;
  } else if (message.type === MessageType.CHANNEL_UNPIN_MESSAGE) {
    return `A message was unpinned`;
  } else if (message.type === MessageType.CHANNEL_CREATE) {
    return `${message.author.username} created the group "${message.metadata.channelName}"`;
  } else {
    return `Unknown message type ${message.type}`;
  }
};
