import { forwardRef } from "react";
import {
  AttachmentSchema,
  MessageSchema,
  MessageType,
} from "../../../../schemas/message";
import { ChannelType } from "../../../../schemas/channel";
import useCurrentUser from "../../../../api/hooks/useCurrentUser";
import Avatar from "../../../../components/Avatar";

const MessageAttachments = ({
  attachments,
}: {
  attachments: AttachmentSchema[];
}) => {
  const images = attachments.filter((a) => a.contentType.startsWith("image/"));
  const videos = attachments.filter((a) => a.contentType.startsWith("video/"));
  const audios = attachments.filter((a) => a.contentType.startsWith("audio/"));
  const others = attachments.filter(
    (a) =>
      !a.contentType.startsWith("image/") &&
      !a.contentType.startsWith("video/") &&
      !a.contentType.startsWith("audio/")
  );

  return (
    <div className="mb-2 space-y-2">
      {images.length > 0 && (
        <div
          className={`grid ${images.length === 1 ? "grid-cols-1" : "grid-cols-2 gap-1"}`}
        >
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={img.filename}
              className="rounded-lg w-full"
            />
          ))}
        </div>
      )}

      {videos.map((video) => (
        <video key={video.id} controls className="w-full rounded-lg">
          <source src={video.url} type={video.contentType} />
        </video>
      ))}

      {audios.map((audio) => (
        <audio key={audio.id} controls className="w-full">
          <source src={audio.url} type={audio.contentType} />
        </audio>
      ))}

      {others.map((file) => (
        <a
          key={file.id}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-400 underline"
        >
          📄 {file.filename} ({(file.size / 1024).toFixed(1)} KB)
        </a>
      ))}
    </div>
  );
};

const MessageStatus = ({ message }: { message: MessageSchema }) => {
  return (
    <span className="float-right ml-[0.4375rem] px-[0.25rem] mt-2 text-[#efeff1] opacity-70 text-xs">
      {message.editedTimestamp && <span>edited</span>}
      {new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
};

interface MessageProps {
  message: MessageSchema;
  channelType: ChannelType;
  showAvatar: boolean;
  showUsername: boolean;
}

const MessageCard = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, channelType, showAvatar, showUsername }, ref) => {
    const { currentUser } = useCurrentUser();
    const isOwnMessage = message.author.id === currentUser!.id;
    const isGroup = channelType === ChannelType.GROUP;

    if (
      message.type !== MessageType.DEFAULT &&
      message.type !== MessageType.REPLY
    ) {
      return (
        <div className="text-center text-sm text-[#efeff1] opacity-50 my-2">
          {message.type === MessageType.MEMBER_ADD &&
            `${message.author.username} added ${message.targetUser?.username}`}
          {message.type === MessageType.MEMBER_REMOVE &&
            `${message.author.username} removed ${message.targetUser?.username}`}
          {message.type === MessageType.MEMBER_LEAVE &&
            `${message.author.username} left the chat`}
          {message.type === MessageType.CHANNEL_TITLE_CHANGE &&
            `Channel name changed to "${message.metadata.newTitle}" by ${message.author.username}`}
          {message.type === MessageType.CHANNEL_IMAGE_CHANGE &&
            `Channel image updated`}
          {message.type === MessageType.CHANNEL_PINNED_MESSAGE &&
            `A message was pinned`}
          {message.type === MessageType.CHANNEL_UNPIN_MESSAGE &&
            `A message was unpinned`}
        </div>
      );
    }

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
          className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-md`}
        >
          {!isOwnMessage && showUsername && isGroup && (
            <div className="text-sm font-medium text-[#efeff1] mb-1">
              {message.author.globalName} ({message.author.username})
            </div>
          )}

          <div
            className={`relative px-3 py-1 text-[#efeff1] rounded-2xl w-fit max-w-full ${
              isOwnMessage
                ? "bg-[#9147ff] rounded-br-sm"
                : "bg-[#1f1f23] rounded-bl-sm"
            }`}
          >
            {message.attachments.length > 0 && (
              <MessageAttachments attachments={message.attachments} />
            )}

            {message.content && (
              <div className="inline-block relative w-full break-words">
                {message.content}
                <MessageStatus message={message} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default MessageCard;
