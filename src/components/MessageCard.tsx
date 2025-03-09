import { forwardRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { ChannelType } from "../schemas/channel.schema";
import { AttachmentSchema, MessageSchema } from "../schemas/message.schema";
import Avatar from "./Avatar";

const AttachmentPreview = ({
  attachments,
}: {
  attachments: AttachmentSchema[];
}) => {
  return (
    <div className="mt-2 space-y-1">
      {attachments.map((attachment) => (
        <a
          key={attachment.id}
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-blue-400 underline truncate"
        >
          {attachment.filename} ({(attachment.size / 1024).toFixed(1)} KB)
        </a>
      ))}
    </div>
  );
};

interface MessageProps {
  message: MessageSchema;
  channelType: ChannelType;
  showAvatar: boolean;
  showUsername: boolean;
}

export const MessageCard = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, channelType, showAvatar, showUsername }, ref) => {
    const { currentUser } = useAuthStore();
    const isOwnMessage = message.author.id === currentUser!.id;
    const isGroup = channelType === ChannelType.GROUP;

    const renderTime = () => (
      <div
        className={`flex items-center gap-1 ${isOwnMessage ? "order-2" : "order-1"}`}
      >
        <span className="text-xs text-gray-300 shrink-0">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    );

    return (
      <div
        ref={ref}
        className={`flex items-end ${
          isOwnMessage ? "justify-end" : "justify-start"
        } gap-2 pb-1 group ${showAvatar ? "mb-2" : ""}`}
      >
        {isGroup && !isOwnMessage && (
          <div className="w-8 h-8 overflow-hidden">
            {showAvatar ? (
              <Avatar
                userId={message.author.id}
                avatar={message.author.avatar}
                username={message.author.username}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        )}

        <div
          className={`flex flex-col ${
            isOwnMessage ? "items-end" : "items-start"
          } max-w-[70%] min-w-[20%]`}
        >
          {!isOwnMessage && showUsername && isGroup && (
            <div className="text-sm font-medium text-gray-300 mb-1">
              {message.author.username}
            </div>
          )}

          <div
            className={`relative p-3 rounded-2xl break-words ${
              isOwnMessage
                ? "bg-[#9147ff] text-white rounded-br-sm"
                : "bg-gray-700 text-white rounded-bl-sm"
            }`}
          >
            <div className="flex flex-wrap gap-2">
              {message.content && (
                <span className="max-w-full break-words">
                  {message.content}
                </span>
              )}

              {message.attachments.length > 0 && (
                <AttachmentPreview attachments={message.attachments} />
              )}

              <div className="flex items-center gap-1 mt-1 ml-auto">
                {renderTime()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default MessageCard;
