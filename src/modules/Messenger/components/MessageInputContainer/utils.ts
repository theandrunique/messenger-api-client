import { createAttachments, uploadFile } from "../../../../api/api";
import { ApiError } from "../../../../schemas/common";
import { CloudAttachmentResponseSchema } from "../../../../schemas/message";
import notifications from "../../../../utils/notifications";
import FileInfo from "../../types/FileInfo";

export const getFailedFiles = (
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

export const handleCreateAttachments = async (
  channelId: string,
  files: File[]
): Promise<[CloudAttachmentResponseSchema, File][]> => {
  const attachmentsToUploadArray = files.map((file, index) => ({
    id: index.toString(),
    filename: file.name,
    fileSize: file.size,
  }));

  try {
    const response = await createAttachments(
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
        return handleCreateAttachments(channelId, validFiles);
      }
      return [];
    }
    throw err;
  }
};

export const uploadFiles = async (channelId: string, files: File[]): Promise<FileInfo[]> => {
  const response = await handleCreateAttachments(channelId, files);

  await Promise.all(
    response.map(async ([attachment, file]) => {
      try {
        await uploadFile(attachment.uploadUrl, file);
      } catch (err) {
        notifications.error(
          `Error while uploading '${file.name}' file. ${err}`
        );
      }
    })
  );

  return response.map(([cloudAttachment, file]) => [file, cloudAttachment]);
};
