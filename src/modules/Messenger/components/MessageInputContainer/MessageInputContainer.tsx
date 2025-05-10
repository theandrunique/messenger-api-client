import { createMessage } from "../../../../api/api";
import MessageAttachmentCard from "./MessageAttachmentCard";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import MessageInput from "./MessageInput";
import { useReplyContext } from "../ReplyContextProvider";
import { CornerUpLeft, X } from "lucide-react";
import Button from "../../../../components/ui/Button";

interface MessageInputContainerProps {
  channelId: string;
}

const MessageInputContainer = ({ channelId }: MessageInputContainerProps) => {
  const {
    messageAttachments,
    onMessageAttachmentRemove,
    clearMessageAttachments,
  } = useMessageAttachmentsUploader();
  const replyContext = useReplyContext();

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
        })),
        replyContext.replyMessage?.id
      );
      replyContext.setReplyMessage(undefined);
      clearMessageAttachments();
    } catch (err) {
      console.log("Error sending message: ", err);
      throw err;
    }
  };

  return (
    <div className="flex flex-col bg-[#0e0e10] px-3 pb-2">
      {replyContext.replyMessage !== undefined && (
        <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
          <div className="px-3 py-1 flex gap-2 items-center justify-between text-[#efeff1]">
            <div className="flex items-center gap-2 min-w-0">
              <CornerUpLeft className="w-6 h-6 shrink-0" />
              <div className="overflow-hidden">
                <div className="font-semibold">
                  {replyContext.replyMessage.author.globalName}
                </div>
                <div className="truncate text-sm">
                  <span className="opacity-70">
                    {replyContext.replyMessage.attachments
                      .map((a) => a.filename)
                      .join(", ")}
                  </span>
                  {replyContext.replyMessage.content.length > 0 &&
                    replyContext.replyMessage.attachments.length > 0 &&
                    ", "}
                  {replyContext.replyMessage.content}
                </div>
              </div>
            </div>
            <Button
              variant="icon"
              onClick={() => replyContext.setReplyMessage(undefined)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
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
