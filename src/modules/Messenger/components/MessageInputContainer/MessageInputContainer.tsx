import { createMessage, updateMessage } from "../../../../api/api";
import MessageAttachmentCard, {
  ExistedAttachment,
} from "./MessageAttachmentCard";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import MessageInput from "./MessageInput";
import { useReplyContext } from "../ReplyContextProvider";
import { CornerUpLeft, X, Pencil } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { useEditMessage } from "../EditMessageProvider";

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
  const editMessageContext = useEditMessage();

  const onSubmit = async (messageContent: string) => {
    if (
      !messageContent.trim() &&
      messageAttachments.length === 0 &&
      editMessageContext.attachments.length === 0
    )
      return;

    if (editMessageContext.message) {
      try {
        const readyAttachments = messageAttachments.filter(
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
        clearMessageAttachments();
      } catch (err) {
        console.log("Error updating message: ", err);
        throw err;
      }
    } else {
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
      {replyContext.replyMessage !== undefined &&
        editMessageContext.message === undefined && (
          <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
            <div className="px-3 py-1 flex gap-2 items-center justify-between text-[#efeff1]">
              <div className="flex items-center gap-2 min-w-0">
                <CornerUpLeft className="w-6 h-6 shrink-0 text-[#a970ff]" />
                <div className="overflow-hidden">
                  <div className="font-semibold text-[#a970ff]">
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
      {(messageAttachments.length > 0 ||
        editMessageContext.attachments.length > 0) && (
          <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
            <div className="flex gap-x-2 gap-y-1 overflow-x-auto p-2 px-3">
              {messageAttachments.map((attachment) => (
                <MessageAttachmentCard
                  attachment={attachment}
                  onRemove={onMessageAttachmentRemove}
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

      <MessageInput onSubmit={onSubmit} />
    </div>
  );
};

export default MessageInputContainer;
