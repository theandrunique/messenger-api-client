import { forwardRef, HTMLAttributes } from "react";
import { useMessageCardContext } from "./MessageCardContext";

interface MessageContainerProps extends HTMLAttributes<HTMLDivElement> {}

const MessageContainer = forwardRef<HTMLDivElement, MessageContainerProps>(({ children, ...props }, ref) => {
  const { showAvatar, isOwnMessage, message } = useMessageCardContext();

  return (
    <div
      data-message-id={message.id}
      data-message-author-id={message.author.id}
      ref={ref}
      className={`flex items-end ${
        isOwnMessage ? "justify-end" : "justify-start"
      } gap-2 pb-1 group ${showAvatar ? "mb-2" : ""}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default MessageContainer;
