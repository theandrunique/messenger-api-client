import { createContext, PropsWithChildren, useState } from "react";
import DropFilesHereMessage from "./ChannelContainer/DropFilesHereMessage";
import { useAttachmentsUploader } from "./AttachmentUploaderProvider";

const AttachmentsDropAreaContext = createContext<{} | null>(null);

type AttachmentsDropAreaProviderProps = {
  className: string;
  channelId: string;
} & PropsWithChildren;

const AttachmentsDropAreaProvider = ({
  children,
  channelId,
  className,
}: AttachmentsDropAreaProviderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const attachmentsUploader = useAttachmentsUploader();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const root = e.currentTarget as HTMLElement;
    if (el && root.contains(el)) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      !e.relatedTarget ||
      !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      attachmentsUploader.upload(files, channelId);
    }
  };

  return (
    <AttachmentsDropAreaContext.Provider value={{}}>
      <div className="relative h-full" onDragEnter={handleDragEnter}>
        <div className={className}>{children}</div>
        {isDragging && (
          <div
            className="absolute inset-0 h-full w-full bg-black/60 z-50 backdrop-blur-sm"
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <DropFilesHereMessage />
          </div>
        )}
      </div>
    </AttachmentsDropAreaContext.Provider>
  );
};

export default AttachmentsDropAreaProvider;
