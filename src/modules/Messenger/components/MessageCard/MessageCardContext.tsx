import { createContext, useContext } from "react";
import { MessageSchema } from "../../../../schemas/message";
import { ChannelType } from "../../../../schemas/channel";

interface MessageCardContextProps {
  message: MessageSchema;
  channelType: ChannelType;
  showAvatar: boolean;
  showUsername: boolean;
  isOwnMessage: boolean;
  isGroup: boolean;
}

const MessageCardContext = createContext<MessageCardContextProps | undefined>(
  undefined
);

export default MessageCardContext;

export const useMessageCardContext = () => {
  const context = useContext(MessageCardContext);

  if (context === undefined)
    throw new Error(
      "useMessageCardContext must be used within MessageCardContext"
    );

  return context;
};
