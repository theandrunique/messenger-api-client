import { useState } from "react";
import api from "../api/api";
import { CircleFadingPlus } from "lucide-react";
import FileCard, { FileInfo } from "./FileCard";

interface MessageInputProps {
  channelId: string;
}

const FilesCard = ({
  files,
  onRemove,
}: {
  files: FileInfo[];
  onRemove: (file: FileInfo) => void;
}) => {
  if (files.length === 0) return null;

  return (
    <div className="p-3 bg-gray-900 rounded-lg flex gap-3 flex-wrap">
      {files.map((fileInfo) => {
        return <FileCard fileInfo={fileInfo} onRemove={onRemove} />;
      })}
    </div>
  );
};

const MessageInput = ({ channelId }: MessageInputProps) => {
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const uploadFiles = async (files: File[]): Promise<FileInfo[]> => {
    try {
      const attachments = files.map((file) => ({
        id: null,
        filename: file.name,
        fileSize: file.size,
      }));

      const response = await api.createAttachments(channelId, attachments);

      await Promise.all(
        response.map(async (f, index) => {
          const file = files[index];
          await api.uploadFile(f.uploadUrl, file);
        })
      );

      return response.map((f, index) => ({
        cloudAttachment: {
          id: f.id,
          uploadUrl: f.uploadUrl,
          uploadFilename: f.uploadFilename,
        },
        file: files[index],
      }));
    } catch (err) {
      console.log("Error uploading files: ", err);
      return [];
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const uploadedFiles = await uploadFiles(files);
    setFileInfos((prev) => [...prev, ...uploadedFiles]);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() && fileInfos.length === 0) return;

    try {
      await api.postMessage(
        channelId,
        messageContent,
        fileInfos.map((f) => ({
          uploadedFilename: f.cloudAttachment.uploadFilename,
          filename: f.file.name,
        }))
      );

      setMessageContent("");
      setFileInfos([]);
    } catch (err) {
      console.log("Error sending message: ", err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) return;

    const uploadedFiles = await uploadFiles(files);

    setFileInfos((prev) => [...prev, ...uploadedFiles]);
  };

  return (
    <>
      <FilesCard
        files={fileInfos}
        onRemove={(fileInfo) => {
          setFileInfos((prev) => prev.filter((f) => f !== fileInfo));
        }}
      />
      <div
        onDrop={handleDrop}
        className="p-2 rounded-lg flex items-center gap-2"
      >
        <button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="px-3 py-2 bg-blue-500 rounded-lg"
        >
          <CircleFadingPlus />
        </button>

        <input
          className="w-full p-2 border rounded-lg text-black"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />

        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="fileInput"
        />

        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          ➤
        </button>
      </div>
    </>
  );
};

export default MessageInput;
