import { createMessage } from "../../../../api/api";
import AttachmentsContainer from "./AttachmentsContainer";
import { useFileUploader } from "./FileUploader";
import MessageInput from "./MessageInput";

interface MessageInputContainerProps {
  channelId: string;
}

const MessageInputContainer = ({ channelId }: MessageInputContainerProps) => {
  const { fileInfos, onFileRemove, clearFileInfos } = useFileUploader();

  const onSubmit = async (messageContent: string) => {
    if (!messageContent.trim() && fileInfos.length === 0) return;

    try {
      await createMessage(
        channelId,
        messageContent,
        fileInfos.map((f) => ({
          uploadedFilename: f[1].uploadFilename,
          filename: f[0].name,
        }))
      );
      clearFileInfos();
    } catch (err) {
      console.log("Error sending message: ", err);
      throw err;
    }
  };

  return (
    <div className="px-3 pb-2 bg-[#0e0e10] flex flex-col">
      <AttachmentsContainer files={fileInfos} onRemove={onFileRemove} />
      <MessageInput onSubmit={onSubmit} />
    </div>
  );
};

export default MessageInputContainer;
