import { createContext, useContext, useEffect, useState } from "react";
import MessageAttachmentInfo from "../types/MessageAttachmentInfo";
import { useMessageAttachmentsUploader } from "./MessageAttachmentsUploader";
import { createMessage } from "../../../api/api";
import { updateUseMessagesOnMessageCreate } from "../../../api/hooks/useMessages";
import { useQueryClient } from "@tanstack/react-query";
import { updateUseUserChannelsOnNewMessage } from "../../../api/hooks/useUserChannels";

export interface PendingMessage {
  nonce: string;
  channelId: string;
  content: string;
  attachments: MessageAttachmentInfo[];
}

interface MessageMutationContextProps {
  pendingMessages: PendingMessage[];
  addMessage: (newMessage: Omit<PendingMessage, "nonce">) => void;
}

const MessageMutationContext = createContext<
  MessageMutationContextProps | undefined
>(undefined);

const MessageMutationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const { setPendingMessageNonce, messageAttachments } =
    useMessageAttachmentsUploader();
  const queryClient = useQueryClient();

  const addMessage = (newMessage: Omit<PendingMessage, "nonce">) => {
    const nonce = crypto.randomUUID();
    setPendingMessages((prev) => [{ ...newMessage, nonce }, ...prev]);
    setPendingMessageNonce(
      newMessage.attachments.map((a) => a.file),
      nonce
    );
  };

  useEffect(() => {
    pendingMessages.forEach((message) => {
      const attachments = messageAttachments.filter(
        (a) => a.pendingMessageNonce === message.nonce
      );

      const isAllUploaded = attachments.every((a) => a.status === "success");

      if (isAllUploaded) {
        sendMessage(message, attachments);
      }
    });
  }, [messageAttachments, pendingMessages]);

  const sendMessage = async (
    message: PendingMessage,
    attachments: MessageAttachmentInfo[]
  ) => {
    try {
      const realMessage = await createMessage(
        message.channelId,
        message.content,
        attachments.map((a) => ({
          uploadedFilename: a.cloudAttachment?.uploadFilename as string,
          filename: a.file.name,
        }))
      );

      updateUseUserChannelsOnNewMessage(queryClient, realMessage);
      updateUseMessagesOnMessageCreate(queryClient, realMessage);

      setPendingMessages((prev) =>
        prev.filter((m) => m.nonce !== message.nonce)
      );
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <MessageMutationContext.Provider value={{ pendingMessages, addMessage }}>
      {children}
    </MessageMutationContext.Provider>
  );
};

export default MessageMutationProvider;

export const useMessageMutation = () => {
  const context = useContext(MessageMutationContext);
  if (context === undefined) {
    throw new Error(
      "useMessageMutation must be used within a MessageMutationProvider"
    );
  }
  return context;
};
