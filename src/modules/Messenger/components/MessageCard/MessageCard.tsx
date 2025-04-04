import { Check, CheckCheck } from "lucide-react";
import { ChannelType } from "../../../../schemas/channel";
import { MessageSchema } from "../../../../schemas/message";
import MessageAttachments from "./MessageAttachments";
import MessageAvatar from "./MessageAvatar";
import MessageCardContext from "./MessageCardContext";
import MessageContainer from "./MessageContainer";
import MetaMessage from "./MetaMessage";
import { isMeteMessage } from "./utils";
import { forwardRef } from "react";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";

const MessageStatus = ({
  message,
  isOwnMessage,
  maxReadAt,
}: {
  message: MessageSchema;
  isOwnMessage: boolean;
  maxReadAt: string;
}) => {
  return (
    <div className="flex items-center justify-end gap-1 ml-auto text-[#efeff1] opacity-70 h-5 text-[12px] font-normal">
      {message.editedTimestamp && <span>edited</span>}
      <span>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isOwnMessage && (
        <span>
          {maxReadAt >= message.id ? (
            <CheckCheck className="w-4 h-4 text-fuchsia-100" />
          ) : (
            <Check className="w-4 h-4 text-fuchsia-100" />
          )}
        </span>
      )}
    </div>
  );
};

interface MessageCardProps {
  message: MessageSchema;
  channelType: ChannelType;
  lastReadAt: string;
  showAvatar: boolean;
  showUsername: boolean;
}

const MessageCard = forwardRef<HTMLDivElement, MessageCardProps>(
  ({ message, channelType, lastReadAt, showAvatar, showUsername }, ref) => {
    const currentUserId = useCurrentUserId();
    const isOwnMessage = message.author.id === currentUserId;
    const isGroup = channelType === ChannelType.GROUP_DM;

    if (isMeteMessage(message.type)) return <MetaMessage message={message} />;

    return (
      <MessageCardContext.Provider
        value={{
          message,
          channelType,
          showAvatar,
          showUsername,
          isOwnMessage,
          isGroup,
        }}
      >
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
              <MessageStatus
                message={message}
                isOwnMessage={isOwnMessage}
                maxReadAt={lastReadAt}
              />
            </div>
          </div>
        </MessageContainer>
      </MessageCardContext.Provider>
    );
  }
);

export default MessageCard;
