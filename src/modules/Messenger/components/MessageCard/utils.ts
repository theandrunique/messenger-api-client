import { MessageType } from "../../../../schemas/message";

export const isMetaMessage = (messageType: MessageType): boolean => {
  return (
    messageType !== MessageType.DEFAULT && messageType !== MessageType.REPLY
  );
};
