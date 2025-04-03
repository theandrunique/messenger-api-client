import { MessageType } from "../../../../schemas/message";

export const isMeteMessage = (messageType: MessageType): boolean => {
  return (
    messageType !== MessageType.DEFAULT && messageType !== MessageType.REPLY
  );
};
