import { Check, CheckCheck, Hourglass } from "lucide-react";

const MessageStatus = ({
  timestamp,
  editedTimestamp = null,
  isOwnMessage,
  status,
}: {
  timestamp: string;
  editedTimestamp?: string | null;
  isOwnMessage: boolean;
  status?: "read" | "unread" | "sending";
}) => {
  return (
    <div className="flex items-center justify-end gap-1 ml-auto text-[#efeff1] opacity-70 h-5 text-[12px] font-normal">
      {editedTimestamp && <span>edited</span>}
      <span>
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isOwnMessage && (
        <span className="text-fuchsia-100">
          {status === "read" && <CheckCheck className="w-4 h-4" />}
          {status === "unread" && <Check className="w-4 h-4" />}
          {status === "sending" && <Hourglass className="w-4 h-4" />}
        </span>
      )}
    </div>
  );
};

export default MessageStatus;
