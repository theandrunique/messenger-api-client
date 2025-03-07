import { forwardRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { ChannelType } from "../schemas/channel.schema";
import { AttachmentSchema, MessageSchema } from "../schemas/message.schema";

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
}

export const MessageCard = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, channelType }, ref) => {
    const { currentUser } = useAuthStore();
    const isOwnMessage = message.author.id === currentUser!.id;

    return (
      <div
        ref={ref}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} gap-2 pb-2 group`}
      >
        {!isOwnMessage && channelType === ChannelType.GROUP && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full text-sm overflow-hidden">
            <img
              src={message.author.image || "/default-avatar.png"}
              alt={message.author.username}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[70%]`}
        >
          {!isOwnMessage && channelType === ChannelType.GROUP && (
            <div className="text-sm font-medium text-gray-300 mb-1">
              {message.author.username}
            </div>
          )}

          <div
            className={`p-3 rounded-2xl break-words ${
              isOwnMessage
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-gray-700 text-white rounded-bl-sm"
            }`}
          >
            {message.content}

            {message.attachments.length > 0 && (
              <AttachmentPreview attachments={message.attachments} />
            )}

            <div className="flex items-center justify-end gap-2 mt-2">
              <span className="text-xs text-gray-300">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default MessageCard;
