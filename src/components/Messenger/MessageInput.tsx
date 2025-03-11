import { useState } from "react";
import api from "../../api/api";
import { SendHorizontal, Paperclip } from "lucide-react";
import FileCard, { FileInfo } from "./FileCard";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { ApiError } from "../../schemas/common.schema";
import { CloudAttachmentResponseSchema } from "../../schemas/message.schema";
import notifications from "../../utils/notifications";

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
    <div className="p-3 rounded-lg flex gap-3 flex-wrap">
      {files.map((fileInfo) => {
        return <FileCard fileInfo={fileInfo} onRemove={onRemove} />;
      })}
    </div>
  );
};

const MessageInput = ({ channelId }: MessageInputProps) => {
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const getFailedFiles = (
    files: File[],
    errors: Record<string, string[]>
  ): [File, string[]][] => {
    const failedFiles: [File, string[]][] = [];

    Object.keys(errors).forEach((key) => {
      const match = key.match(/files\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        const errorMessages = errors[key];
        const file = files[index];

        if (file) {
          failedFiles.push([file, errorMessages]);
        }
      }
    });

    return failedFiles;
  };

  const createAttachments = async (
    files: File[]
  ): Promise<[CloudAttachmentResponseSchema, File][]> => {
    const attachmentsToUploadArray = files.map((file, index) => ({
      id: index.toString(),
      filename: file.name,
      fileSize: file.size,
    }));

    try {
      const response = await api.createAttachments(
        channelId,
        attachmentsToUploadArray
      );

      const result: [CloudAttachmentResponseSchema, File][] = [];

      response.forEach((f, index) => {
        result.push([f, files[index]]);
      });
      return result;
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const failedFiles = getFailedFiles(files, err.errors);

        failedFiles.forEach(([file, errors]) => {
          const errorMessage = errors.join("\n");
          notifications.error(
            `File '${file.name}' was not uploaded. ${errorMessage}`
          );
        });

        const validFiles = files.filter(
          (file) => !failedFiles.some(([failed]) => failed.name === file.name)
        );

        if (validFiles.length > 0) {
          return createAttachments(validFiles);
        }
        return [];
      }
      throw err;
    }
  };

  const uploadFiles = async (files: File[]): Promise<FileInfo[]> => {
    const response = await createAttachments(files);

    await Promise.all(
      response.map(async ([attachment, file]) => {
        try {
          await api.uploadFile(attachment.uploadUrl, file);
        } catch (err) {
          notifications.error(
            `Error while uploading '${file.name}' file. ${err}`
          );
        }
      })
    );

    return response.map(([attachment, file]) => ({
      cloudAttachment: {
        id: attachment.id,
        uploadUrl: attachment.uploadUrl,
        uploadFilename: attachment.uploadFilename,
      },
      file: file,
    }));
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

  const handleEnterDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        <Button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="px-2 py-2 rounded-lg"
        >
          <Paperclip />
        </Button>

        <Input
          className="w-full p-2 rounded-lg"
          placeholder="Send a message"
          value={messageContent}
          onKeyDown={handleEnterDown}
          onChange={(e) => setMessageContent(e.target.value)}
        />

        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="fileInput"
        />

        <Button onClick={handleSendMessage} className="px-4 py-2 rounded-lg">
          <SendHorizontal />
        </Button>
      </div>
    </>
  );
};

export default MessageInput;
