import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import { PendingMessage } from "../MessageMutationProvider";
import MessageStatus from "./MessageStatus";

interface PendingMessageCardProps {
  message: PendingMessage;
}

const PendingMessageCard = ({ message }: PendingMessageCardProps) => {
  const { messageAttachments } = useMessageAttachmentsUploader();

  return (
    <div className="flex items-end justify-end pb-1 group">
      <div className="flex flex-col max-w-[80%] md:max-w-md">
        <div className="relative px-3 py-1 text-[#efeff1] rounded-2xl max-w-full bg-[#9147ff] rounded-br-sm">
          {messageAttachments
            .filter((a) => a.nonce === message.nonce)
            .map((attachment) => (
              <div>{attachment.file.name}</div>
            ))}
          {message.content && (
            <div className="relative w-full break-words">{message.content}</div>
          )}
          <MessageStatus
            timestamp={new Date().toISOString()}
            isOwnMessage={true}
            status="sending"
          />
        </div>
      </div>
    </div>
  );
};

export default PendingMessageCard;
