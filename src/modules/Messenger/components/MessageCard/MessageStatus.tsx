import { Check, CheckCheck } from "lucide-react";
import { MessageSchema } from "../../../../schemas/message";
import cn from "../../../../utils/cn";

const MessageStatus = ({
  message,
  isOwnMessage,
  maxReadAt,
  className,
}: {
  message: MessageSchema;
  isOwnMessage: boolean;
  maxReadAt: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end text-[#efeff1] opacity-70 h-5 text-[12px] whitespace-nowrap",
        className
      )}
    >
      <span className="mr-1">
        {message.editedTimestamp && "edited "}
        {new Date(message.timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isOwnMessage && (
        <span>
          {maxReadAt >= message.id ? (
            <CheckCheck className="w-4 h-4 text-fuchsia-100" />
          ) : (
            <Check className="w-4 h-4 text-fuchsia-100" />
          )}
        </span>
      )}
    </div>
  );
};

export default MessageStatus;
