import { useMutation } from "@tanstack/react-query";
import notifications from "../../../../utils/notifications";
import { useEditMessageContext } from "../EditMessageProvider";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import { MessageAttachmentUploadSchema } from "../../../../schemas/message";
import { updateMessage } from "../../../../api/api";
import { ApiError } from "../../../../schemas/common";

const useEditMessageMutation = () => {
  const {
    clearMessageAttachments,
  } = useMessageAttachmentsUploader();
  const editMessageContext = useEditMessageContext();

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
      return updateMessage(
        channelId,
        editMessageContext.message!.id,
        content,
        attachments
      );
    },
    onSuccess: () => {
      editMessageContext.set(undefined);
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

export default useEditMessageMutation;
