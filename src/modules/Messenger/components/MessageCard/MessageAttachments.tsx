import { AttachmentSchema } from "../../../../schemas/message";

const MessageAttachments = ({
  attachments,
}: {
  attachments: AttachmentSchema[];
}) => {
  const images = attachments.filter((a) => a.contentType.startsWith("image/"));
  const videos = attachments.filter((a) => a.contentType.startsWith("video/"));
  const audios = attachments.filter((a) => a.contentType.startsWith("audio/"));
  const others = attachments.filter(
    (a) =>
      !a.contentType.startsWith("image/") &&
      !a.contentType.startsWith("video/") &&
      !a.contentType.startsWith("audio/")
  );

  return (
    <div className="mb-2 space-y-2">
      {images.length > 0 && (
        <div
          className={`grid ${images.length === 1 ? "grid-cols-1" : "grid-cols-2 gap-1"}`}
        >
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={img.filename}
              className="rounded-lg w-full"
            />
          ))}
        </div>
      )}

      {videos.map((video) => (
        <video key={video.id} controls className="w-full rounded-lg">
          <source src={video.url} type={video.contentType} />
        </video>
      ))}

      {audios.map((audio) => (
        <audio key={audio.id} controls className="w-full">
          <source src={audio.url} type={audio.contentType} />
        </audio>
      ))}

      {others.map((file) => (
        <a
          key={file.id}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-400 underline"
        >
          📄 {file.filename} ({(file.size / 1024).toFixed(1)} KB)
        </a>
      ))}
    </div>
  );
};

export default MessageAttachments;
