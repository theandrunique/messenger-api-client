import { useMutation } from "@tanstack/react-query";
import { createMessage } from "../../../api/api";
import { MessageAttachmentUploadSchema } from "../../../schemas/message";
import { MessageSchema } from "../../../schemas/message";

interface CreateMessageParams {
  channelId: string;
  content: string;
  attachments: MessageAttachmentUploadSchema[];
}

const createMessageMutation = () => {
  const context = useMutation<MessageSchema, Error, CreateMessageParams>({
    mutationFn: (data) => {
      return createMessage(data.channelId, data.content, data.attachments);
    },
  });

}

export default createMessageMutation;
