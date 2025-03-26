import useCurrentUser from "../../../../api/hooks/useCurrentUser";
import { ChannelType } from "../../../../schemas/channel";
import { MessageSchema } from "../../../../schemas/message";
import MessageAttachments from "./MessageAttachments";
import MessageAvatar from "./MessageAvatar";
import MessageCardContext from "./MessageCardContext";
import MessageContainer from "./MessageContainer";
import MetaMessage from "./MetaMessage";
import { isMeteMessage } from "./utils";
import { forwardRef } from "react";

const MessageStatus = ({ message }: { message: MessageSchema }) => {
  return (
    <div className="flex items-center justify-end gap-1 ml-auto text-[#efeff1] opacity-70 h-5 text-[12px] font-normal">
      {message.editedTimestamp && <span>edited</span>}
      <span>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};

interface MessageCardProps {
  message: MessageSchema;
  channelType: ChannelType;
  showAvatar: boolean;
  showUsername: boolean;
}

const MessageCard = forwardRef<HTMLDivElement, MessageCardProps>(
  ({ message, channelType, showAvatar, showUsername }, ref) => {
    const { currentUser } = useCurrentUser();
    const isOwnMessage = message.author.id === currentUser!.id;
    const isGroup = channelType === ChannelType.GROUP;

    if (isMeteMessage(message.type)) return <MetaMessage message={message} />;

    const contextValue = {
      message,
      channelType,
      showAvatar,
      showUsername,
      isOwnMessage,
      isGroup,
    };

    return (
      <MessageCardContext.Provider value={contextValue}>
        <MessageContainer ref={ref}>
          <MessageAvatar />

          <div
            className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[80%] md:max-w-md`}
          >
            {!isOwnMessage && showUsername && isGroup && (
              <div className="text-sm font-medium text-[#efeff1]">
                {message.author.globalName} ({message.author.username})
              </div>
            )}

            <div
              className={`relative px-3 py-1 text-[#efeff1] rounded-2xl max-w-full ${
                isOwnMessage
                  ? "bg-[#9147ff] rounded-br-sm"
                  : "bg-[#1f1f23] rounded-bl-sm"
              }`}
            >
              {message.attachments.length > 0 && (
                <MessageAttachments attachments={message.attachments} />
              )}

              {message.content && (
                <div className="relative w-full break-words">
                  {message.content}
                </div>
              )}
              <MessageStatus message={message} />
            </div>
          </div>
        </MessageContainer>
      </MessageCardContext.Provider>
    );
  }
);

export default MessageCard;
