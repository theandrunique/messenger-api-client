import { Avatar } from "../../../../components/Avatar/Avatar";
import { UserAvatar, UserAvatarFallback } from "../../../../components/Avatar/UserAvatar";
import { useCurrentUserId } from "../../../../components/CurrentUserProvider";
import { ChannelSchema } from "../../../../schemas/channel";
import { MessageSchema } from "../../../../schemas/message";
import MessageCard from "../MessageCard";
import MetaMessage from "../MessageCard/MetaMessage";
import { isMetaMessage } from "../MessageCard/utils";

interface MessageGroupProps {
  messages: MessageSchema[];
  channel: ChannelSchema;
}

const MessageGroup = ({ messages, channel }: MessageGroupProps) => {
  const currentUserId = useCurrentUserId();
  const isOwnMessage = currentUserId === messages[0].author.id;
  const user = messages[0].author;

  if (isMetaMessage(messages[0].type)) {
    return <div className="flex flex-col-reverse">
      {messages.map(message => 
        <MetaMessage message={message} />
      )}
    </div>
  }

  return (
    <div className="w-full flex justify-start gap-2">
      <div className="sticky bottom-2 self-end text-[0]">
        <Avatar className="w-8 h-8">
          <UserAvatar
            userId={user.id}
            avatar={user.avatar}
          />
          <UserAvatarFallback username={user.username} />
        </Avatar>
      </div>

      <div className="flex flex-col-reverse gap-0.5 w-full max-w-[calc(100%-3rem)]">
        {messages.map((message, i) => (
          <MessageCard
            message={message}
            isOwnMessage={isOwnMessage}
            maxReadAt={channel.maxReadMessageId || "0"}
            showAuthor={i === messages.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

export default MessageGroup;
