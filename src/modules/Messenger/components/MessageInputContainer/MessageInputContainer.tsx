import { createMessage, updateMessage } from "../../../../api/api";
import MessageAttachmentCard, {
  ExistedAttachment,
} from "./MessageAttachmentCard";
import MessageInput from "./MessageInput";
import { CornerUpLeft, X, Pencil } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { useEditContextMessage } from "../EditMessageProvider";
import { useAttachmentsUploader } from "../AttachmentUploaderProvider";
import { useReplyMessageContext } from "../ReplyMessageProvider";

interface MessageInputContainerProps {
  channelId: string;
}

const MessageInputContainer = ({ channelId }: MessageInputContainerProps) => {
  const attachmentsUploaderContext = useAttachmentsUploader();

  const replyMessageContext = useReplyMessageContext();
  const editMessageContext = useEditContextMessage();

  const onSubmit = async (messageContent: string) => {
    if (
      !messageContent.trim() &&
      attachmentsUploaderContext.attachments.length === 0 &&
      editMessageContext.attachments.length === 0
    )
      return;

    if (editMessageContext.message) {
      try {
        const readyAttachments = attachmentsUploaderContext.attachments.filter(
          (f) => f.status === "success" && f.cloudAttachment !== null
        );

        await updateMessage(
          channelId,
          editMessageContext.message.id,
          messageContent,
          readyAttachments
            .map((f) => ({
              uploadedFilename: f.cloudAttachment?.uploadFilename as string, // make TS happy :)
              filename: f.file.name,
            }))
            .concat(
              editMessageContext.attachments.map((a) => ({
                uploadedFilename: `attachments/${channelId}/${a.id}/${a.filename}`,
                filename: a.filename,
              }))
            )
        );
        editMessageContext.set(undefined);
        attachmentsUploaderContext.clearAttachments();
      } catch (err) {
        console.log("Error updating message: ", err);
        throw err;
      }
    } else {
      try {
        const readyAttachments = attachmentsUploaderContext.attachments.filter(
          (f) => f.status === "success" && f.cloudAttachment !== null
        );

        await createMessage(
          channelId,
          messageContent,
          readyAttachments.map((f) => ({
            uploadedFilename: f.cloudAttachment?.uploadFilename as string, // make TS happy :)
            filename: f.file.name,
          })),
          replyMessageContext.replyMessage?.id
        );
        replyMessageContext.set(undefined);
        attachmentsUploaderContext.clearAttachments();
      } catch (err) {
        console.log("Error sending message: ", err);
        throw err;
      }
    }
  };

  return (
    <div className="flex flex-col bg-[#0e0e10] px-3 pb-2">
      {editMessageContext.message !== undefined && (
        <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
          <div className="px-3 py-1 flex gap-2 items-center justify-between text-[#efeff1]">
            <div className="flex items-center gap-2 min-w-0">
              <Pencil className="w-6 h-6 shrink-0 text-[#a970ff]" />
              <div className="overflow-hidden">
                <div className="font-semibold text-[#a970ff]">Edit Message</div>
                <div className="truncate text-sm">
                  <span className="opacity-70">
                    {editMessageContext.message.attachments
                      .map((a) => a.filename)
                      .join(", ")}
                  </span>
                  {editMessageContext.message.content.length > 0 &&
                    editMessageContext.message.attachments.length > 0 &&
                    ", "}
                  {editMessageContext.message.content}
                </div>
              </div>
            </div>
            <Button
              variant="icon"
              onClick={() => editMessageContext.set(undefined)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
      {replyMessageContext.replyMessage !== undefined &&
        editMessageContext.message === undefined && (
          <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
            <div className="px-3 py-1 flex gap-2 items-center justify-between text-[#efeff1]">
              <div className="flex items-center gap-2 min-w-0">
                <CornerUpLeft className="w-6 h-6 shrink-0 text-[#a970ff]" />
                <div className="overflow-hidden">
                  <div className="font-semibold text-[#a970ff]">
                    {replyMessageContext.replyMessage.author.globalName}
                  </div>
                  <div className="truncate text-sm">
                    <span className="opacity-70">
                      {replyMessageContext.replyMessage.attachments
                        .map((a) => a.filename)
                        .join(", ")}
                    </span>
                    {replyMessageContext.replyMessage.content.length > 0 &&
                      replyMessageContext.replyMessage.attachments.length > 0 &&
                      ", "}
                    {replyMessageContext.replyMessage.content}
                  </div>
                </div>
              </div>
              <Button
                variant="icon"
                onClick={() => replyMessageContext.set(undefined)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      {(attachmentsUploaderContext.attachments.length > 0 ||
        editMessageContext.attachments.length > 0) && (
        <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
          <div className="flex gap-x-2 gap-y-1 overflow-x-auto p-2 px-3">
            {attachmentsUploaderContext.attachments.map((attachment) => (
              <MessageAttachmentCard
                attachment={attachment}
                onRemove={attachmentsUploaderContext.onRemove}
              />
            ))}
            {editMessageContext.attachments.map((attachment) => (
              <ExistedAttachment
                attachment={attachment}
                onRemove={() =>
                  editMessageContext.onAttachmentRemove(attachment.id)
                }
              />
            ))}
          </div>
        </div>
      )}

      <MessageInput onSubmit={onSubmit} channelId={channelId} />
    </div>
  );
};

export default MessageInputContainer;
