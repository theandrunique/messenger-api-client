import { useState } from "react";
import Input from "./ui/Input";
import api from "../api/api";
import { X, File as FileIcon, CircleFadingPlus } from "lucide-react";

interface MessageInputProps {
  channelId: string;
}

interface CloudAttachmentSchema {
  id: string | null;
  uploadUrl: string;
  uploadFilename: string;
}

interface FileInfo {
  cloudAttachment: CloudAttachmentSchema;
  file: File;
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

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
        const isImage = fileInfo.file.type.startsWith("image");
        return (
          <div
            key={fileInfo.file.name}
            className="bg-gray-800 p-1 rounded-lg flex items-center gap-2 relative w-48"
          >
            {isImage ? (
              <img
                src={URL.createObjectURL(fileInfo.file)}
                alt={fileInfo.file.name}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <FileIcon className="w-12 h-12 text-gray-400" />
            )}
            <div className="flex flex-col flex-1 truncate">
              <span className="text-sm text-white truncate">
                {fileInfo.file.name}
              </span>
              <span className="text-xs text-gray-400">
                {formatFileSize(fileInfo.file.size)}
              </span>
            </div>
            <button
              className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500"
              onClick={() => onRemove(fileInfo)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
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
        onRemove={(file) =>
          setFileInfos((prev) => prev.filter((f) => f !== file))
        }
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
