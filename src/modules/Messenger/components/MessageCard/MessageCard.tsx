import { MessageSchema } from "../../../../schemas/message";
import MessageAttachments from "./MessageAttachments";
import MessageStatus from "./MessageStatus";

interface MessageCard {
  message: MessageSchema;
  isOwnMessage: boolean;
  maxReadAt: string;
  showAuthor?: boolean;
}

const MessageCard = ({ message, isOwnMessage, maxReadAt, showAuthor = false }: MessageCard) => {
  return (
    <div
      data-message-id={message.id}
      data-message-author-id={message.author.id}
      className={`relative w-fit pl-2.5 pr-3 py-1.5 text-[#efeff1] text-sm rounded-2xl ${
        isOwnMessage ? "bg-[#9147ff]" : "bg-[#1f1f23]"
      }`}
      style={{
        maxWidth: "min(90%, 28rem)"
      }}
    >
      {showAuthor && (
        <div className={`font-semibold leading-none`}>
          {message.author.globalName}
        </div>
      )}
      {message.attachments.length > 0 && (
        <MessageAttachments attachments={message.attachments} />
      )}
      {message.content.length === 0 ? (
        <div className="absolute bottom-0 right-1.5">
          <MessageStatus
            message={message}
            isOwnMessage={isOwnMessage}
            maxReadAt={maxReadAt}
          />
        </div>
      ) : (
        <div className="break-words whitespace-pre-wrap">
          {message.content}
          <span className="relative float-right ml-1.5">
            <MessageStatus
              message={message}
              isOwnMessage={isOwnMessage}
              maxReadAt={maxReadAt}
              className="opacity-0"
            />
            <div className="absolute top-1 left-1.5">
              <MessageStatus
                message={message}
                isOwnMessage={isOwnMessage}
                maxReadAt={maxReadAt}
              />
            </div>
          </span>
        </div>
      )}
    </div>
  );
}

export default MessageCard;
