import { createAttachments } from "../../../../api/api";
import { CloudAttachmentSchema } from "../../../../schemas/message";

export const handleCreateAttachments = async (
  channelId: string,
  files: File[]
): Promise<[[File, CloudAttachmentSchema][], [File, string[]][]]> => {
  const attachmentsToUploadArray = files.map((file, index) => ({
    id: index.toString(),
    filename: file.name,
    fileSize: file.size,
  }));

  const response = await createAttachments(channelId, attachmentsToUploadArray);

  const result: [File, CloudAttachmentSchema][] = [];
  const errors: [File, string[]][] = [];

  response.results.forEach((cloudAttachment) => {
    if (!cloudAttachment.id) return;
    const index = parseInt(cloudAttachment.id);
    result.push([files[index], cloudAttachment]);
  });

  response.errors.forEach((cloudAttachmentError) => {
    if (!cloudAttachmentError.id) return;
    const index = parseInt(cloudAttachmentError.id);
    errors.push([files[index], cloudAttachmentError.errors]);
  });

  return [result, errors];
};
