import { createMessage } from "../../../../api/api";
import MessageAttachmentCard from "./MessageAttachmentCard";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import MessageInput from "./MessageInput";

interface MessageInputContainerProps {
  channelId: string;
}

const MessageInputContainer = ({ channelId }: MessageInputContainerProps) => {
  const {
    messageAttachments,
    onMessageAttachmentRemove,
    clearMessageAttachments,
  } = useMessageAttachmentsUploader();

  const onSubmit = async (messageContent: string) => {
    if (!messageContent.trim() && messageAttachments.length === 0) return;

    try {
      const readyAttachments = messageAttachments.filter(
        (f) => f.status === "success" && f.cloudAttachment !== null
      );

      await createMessage(
        channelId,
        messageContent,
        readyAttachments.map((f) => ({
          uploadedFilename: f.cloudAttachment?.uploadFilename as string, // make TS happy :)
          filename: f.file.name,
        }))
      );
      clearMessageAttachments();
    } catch (err) {
      console.log("Error sending message: ", err);
      throw err;
    }
  };

  return (
    <div className="flex flex-col bg-[#0e0e10] px-3 pb-2">
      {messageAttachments.length > 0 && (
        <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
          <div className="flex gap-x-2 gap-y-1 overflow-x-auto p-2 px-3">
            {messageAttachments.map((attachment) => (
              <MessageAttachmentCard
                attachment={attachment}
                onRemove={onMessageAttachmentRemove}
              />
            ))}
          </div>
        </div>
      )}

      <MessageInput onSubmit={onSubmit} />
    </div>
  );
};

export default MessageInputContainer;
