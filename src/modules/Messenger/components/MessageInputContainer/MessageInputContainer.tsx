import { createMessage } from "../../../../api/api";
import FileCard from "./FileCard";
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
    <div className="flex flex-col bg-[#0e0e10] px-3 pb-2">
      {fileInfos.length > 0 && (
        <div className="border-t border-x rounded-lg border-[#38383f] mb-[-10px] pb-[10px] bg-[#18181b]">
          <div className="flex gap-x-2 gap-y-1 flex-wrap p-1 ">
            {fileInfos.map((fileInfo) => (
              <FileCard fileInfo={fileInfo} onRemove={onFileRemove} />
            ))}
          </div>
        </div>
      )}

      <MessageInput onSubmit={onSubmit} />
    </div>
  );
};

export default MessageInputContainer;
