import { MessageSchema } from "../../../../schemas/message";
import { renderMetaMessageText } from "./utils";

const MetaMessage = ({ message }: { message: MessageSchema }) => {
  return (
    <div
      data-message-id={message.id}
      data-message-author-id={message.author.id}
      className="text-center text-sm text-[#efeff1] opacity-50 my-2"
    >
      {renderMetaMessageText(message)}
    </div>
  );
};

export default MetaMessage;
