import { MessageSchema } from "../../../../schemas/message";
import cn from "../../../../utils/cn";

interface RepliedMessageProps {
  message?: MessageSchema;
  isOwnMessage: boolean;
}

const RepliedMessage = ({ message, isOwnMessage }: RepliedMessageProps) => {
  if (!message) return null;

  const colors = cn({
    "bg-[#5c16c5]/50": isOwnMessage,
    "border-[#5c16c5]": isOwnMessage,
    "border-purple-800": !isOwnMessage,
    "bg-purple-800/30": !isOwnMessage,
  });

  return (
    <div
      className={`p-2 py-1 mt-1 leading-none rounded-md border-l-4 ${colors}`}
    >
      <div className="font-medium">{message.author.globalName}</div>
      <div>
        <div className="truncate text-sm">
          <span className="opacity-70">
            {message.attachments.map((a) => a.filename).join(", ")}
          </span>
          {message.content.length > 0 && message.attachments.length > 0 && ", "}
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default RepliedMessage;
