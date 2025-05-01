import { Avatar } from "../../../../components/Avatar/Avatar";
import {
  UserAvatar,
  UserAvatarFallback,
} from "../../../../components/Avatar/UserAvatar";
import { useMessageCardContext } from "./MessageCardContext";

const MessageAvatar = () => {
  const { isGroup, isOwnMessage, showAvatar, message } =
    useMessageCardContext();

  if (isGroup && !isOwnMessage) {
    return (
      <div className="w-8 h-8 overflow-hidden">
        {showAvatar ? (
          <Avatar>
            <UserAvatar
              userId={message.author.id}
              avatar={message.author.avatar}
            />
            <UserAvatarFallback username={message.author.username} />
          </Avatar>
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
    );
  }
  return null;
};

export default MessageAvatar;
