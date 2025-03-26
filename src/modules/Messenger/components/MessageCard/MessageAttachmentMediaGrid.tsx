import { AttachmentSchema } from "../../../../schemas/message";

const isImage = (type: string) => type.startsWith("image/");
const isVideo = (type: string) => type.startsWith("video/");

const MediaGrid = ({ attachments }: { attachments: AttachmentSchema[] }) => {
  const total = attachments.length;
  if (total === 0) return null;

  return (
    <div className="grid gap-1 w-full h-full relative">
      {total === 1 && (
        <MediaItem
          attachment={attachments[0]}
          className="w-full h-full max-h-[250px]"
        />
      )}

      {total === 2 && (
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          {attachments.map((attachment) => (
            <MediaItem
              key={attachment.id}
              attachment={attachment}
              className="w-full h-full aspect-[4/3]"
            />
          ))}
        </div>
      )}

      {total === 3 && (
        <div className="grid grid-rows-2 gap-1 w-full max-h-[450px]">
          <MediaItem
            attachment={attachments[0]}
            className="w-full h-full mah-h-[250px]"
          />
          <div className="grid grid-cols-2 gap-1 h-full">
            {attachments.slice(1).map((attachment) => (
              <MediaItem
                key={attachment.id}
                attachment={attachment}
                className="w-full h-full aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      )}

      {total === 4 && (
        <div className="grid grid-rows-2 gap-1 w-full max-h-[450px]">
          <MediaItem
            attachment={attachments[0]}
            className="w-full h-full row-span-1"
          />
          <div className="grid grid-cols-3 gap-1 h-full">
            {attachments.slice(1).map((attachment) => (
              <MediaItem
                key={attachment.id}
                attachment={attachment}
                className="w-full h-full aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      )}

      {total >= 5 && (
        <div className="grid grid-rows-2 gap-1 w-full h-full">
          <MediaItem
            attachment={attachments[0]}
            className="w-full h-full row-span-1"
          />
          <div className="grid grid-cols-3 gap-1 h-full relative">
            {attachments.slice(1, 5).map((attachment) => (
              <MediaItem
                key={attachment.id}
                attachment={attachment}
                className="w-full h-full"
              />
            ))}
            {total > 5 && (
              <div className="absolute bottom-0 right-0 bg-black/60 text-white text-lg font-bold flex items-center justify-center rounded-lg w-full h-full">
                +{total - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MediaItem = ({
  attachment,
  className,
}: {
  attachment: AttachmentSchema;
  className: string;
}) => {
  return isImage(attachment.contentType) ? (
    <img
      src={attachment.url}
      alt={attachment.filename}
      className={`${className} object-cover rounded-lg`}
    />
  ) : isVideo(attachment.contentType) ? (
    <div className={`${className} rounded-lg overflow-hidden`}>
      <video
        controls
        src={attachment.url}
        className="w-full h-full object-fit"
      />
    </div>
  ) : null;
};

export default MediaGrid;
