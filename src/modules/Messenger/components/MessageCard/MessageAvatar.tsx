import Avatar from "../../../../components/Avatar";
import { useMessageCardContext } from "./MessageCardContext";

const MessageAvatar = () => {
  const { isGroup, isOwnMessage, showAvatar, message} = useMessageCardContext();

  if (isGroup && !isOwnMessage) {
    return (
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
    )
  }
  return null;
}

export default MessageAvatar;
