import { FC } from "react";
import { MessageSchema } from "../entities";

interface MessageProps {
  message: MessageSchema;
}

const Message: FC<MessageProps> = ({ message }) => {
  return (
    <div className="flex flex-col p-2 space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm">
          {message.author.globalName[0].toUpperCase()}
        </div>
        <div className="text-sm text-gray-300">{message.author.username}</div>
      </div>

      <div className="p-2 bg-gray-700 rounded-md text-white">
        {message.content}
        {message.attachments.length > 0 && (
          <div className="mt-2 text-xs text-gray-400">
            {message.attachments.length} вложение(й)
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 self-end">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;
