import { useMutation } from "@tanstack/react-query";
import notifications from "../../../../utils/notifications";
import { ApiError } from "../../../../schemas/common";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import { MessageAttachmentUploadSchema } from "../../../../schemas/message";
import { createMessage } from "../../../../api/api";
import { useReplyMessageContext } from "../ReplyMessageProvider";

const useCreateMessageMutation = () => {
  const {
    clearMessageAttachments,
  } = useMessageAttachmentsUploader();

  const replyContext = useReplyMessageContext();

  return useMutation({
    mutationFn: ({
      channelId,
      content,
      attachments,
    }: {
      channelId: string;
      content: string;
      attachments: MessageAttachmentUploadSchema[];
    }) => {
      return createMessage(
        channelId,
        content,
        attachments,
        replyContext.replyMessage?.id
      );
    },
    onSuccess: () => {
      replyContext.set(undefined);
      clearMessageAttachments();
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        notifications.error(err.message);
      } else {
        notifications.error("Something went wrong.");
      }
    },
  });
}

export default useCreateMessageMutation;
