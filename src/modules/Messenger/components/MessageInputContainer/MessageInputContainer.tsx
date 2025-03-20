import { createMessage } from "../../../../api/api";
import FileCard from "./FileCard";
import { useFileUploader } from "./FileUploader";
import MessageInput from "./MessageInput";

interface MessageInputContainerProps {
  channelId: string;
}

const MessageInputContainer = ({ channelId }: MessageInputContainerProps) => {
  const { attachments, onAttachmentRemove, clearAttachments } =
    useFileUploader();

  const onSubmit = async (messageContent: string) => {
    if (!messageContent.trim() && attachments.length === 0) return;

    try {
      const readyAttachments = attachments.filter(
        (f) => f.status === "success" && f.cloudAttachment !== null
      );

      await createMessage(
        channelId,
        messageContent,
        readyAttachments.map((f) => ({
          uploadedFilename: f.cloudAttachment?.uploadFilename || "", // make TS happy
          filename: f.file.name,
        }))
      );
      clearAttachments(readyAttachments);
    } catch (err) {
      console.log("Error sending message: ", err);
      throw err;
    }
  };

  return (
    <div className="flex flex-col bg-[#0e0e10] px-3 pb-2">
      {attachments.length > 0 && (
        <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
          <div className="flex gap-x-2 gap-y-1 flex-wrap p-2 px-3">
            {attachments.map((attachment) => (
              <FileCard attachment={attachment} onRemove={onAttachmentRemove} />
            ))}
          </div>
        </div>
      )}

      <MessageInput onSubmit={onSubmit} />
    </div>
  );
};

export default MessageInputContainer;
