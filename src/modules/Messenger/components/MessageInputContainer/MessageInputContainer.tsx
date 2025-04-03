import MessageAttachmentCard from "./MessageAttachmentCard";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import MessageInput from "./MessageInput";
import { useMessageMutation } from "../MessageMutationProvider";
import { useMemo } from "react";

interface MessageInputContainerProps {
  channelId: string;
}

const MessageInputContainer = ({ channelId }: MessageInputContainerProps) => {
  const { messageAttachments, onMessageAttachmentRemove } =
    useMessageAttachmentsUploader();
  const { addMessage } = useMessageMutation();

  const onSubmit = async (messageContent: string) => {
    if (!messageContent.trim() && messageAttachments.length === 0) return;

    addMessage({
      channelId: channelId,
      content: messageContent,
      attachments: messageAttachments,
    });
  };

  const attachments = useMemo(() => {
    return messageAttachments.filter((a) => !a.nonce);
  }, [messageAttachments]);

  return (
    <div className="flex flex-col bg-[#0e0e10] px-3 pb-2">
      {attachments.length > 0 && (
        <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
          <div className="flex gap-x-2 gap-y-1 overflow-x-auto p-2 px-3">
            {attachments.map((attachment) => (
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
