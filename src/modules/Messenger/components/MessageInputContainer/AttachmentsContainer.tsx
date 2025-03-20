import FileInfo from "../../types/FileInfo";
import FileCard from "./FileCard";

interface AttachmentsContainerProps {
  files: FileInfo[],
  onRemove: (file: FileInfo) => void;
}

const AttachmentsContainer = ({
  files,
  onRemove,
}: AttachmentsContainerProps) => {
  if (files.length === 0) return null;

  return (
    <div className="p-3 rounded-lg flex gap-3 flex-wrap">
      {files.map((fileInfo) => {
        return <FileCard fileInfo={fileInfo} onRemove={onRemove} />;
      })}
    </div>
  );
};

export default AttachmentsContainer;
