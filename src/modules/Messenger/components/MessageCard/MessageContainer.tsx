import { forwardRef, HTMLAttributes } from "react";
import { useMessageCardContext } from "./MessageCardContext";

interface MessageContainerProps extends HTMLAttributes<HTMLDivElement> {}

const MessageContainer = forwardRef<HTMLDivElement, MessageContainerProps>(({ children, ...props }, ref) => {
  const { showAvatar, isOwnMessage } = useMessageCardContext();

  return (
    <div
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
