import { forwardRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { ChannelType } from "../schemas/channel.schema";
import { AttachmentSchema, MessageSchema } from "../schemas/message.schema";

const AttachmentPreview = ({ attachments }: { attachments: AttachmentSchema[] }) => {
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
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} pb-1`}
      >
        {!isOwnMessage && channelType === ChannelType.GROUP && (
          <div className="text-sm text-gray-300 mb-1">
            {message.author.username}
          </div>
        )}
        <div
          className={`p-2 rounded-lg max-w-xs break-words ${
            isOwnMessage
              ? "bg-blue-600 text-white self-end"
              : "bg-gray-700 text-white"
          }`}
        >
          {message.content}
          {message.attachments.length > 0 && (
            <AttachmentPreview attachments={message.attachments} />
          )}
          <div className="text-xs text-gray-400 mt-1 text-right">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  }
);

export default MessageCard;
