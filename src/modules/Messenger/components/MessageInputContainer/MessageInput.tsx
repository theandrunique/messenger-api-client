import { PlusCircle, SendHorizonal } from "lucide-react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import { ChangeEvent, useRef } from "react";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";

interface MessageInputProps {
  onSubmit: (messageContent: string) => Promise<void>;
}

const MessageInput = ({ onSubmit }: MessageInputProps) => {
  const { onFilesSelect } = useMessageAttachmentsUploader();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    onFilesSelect(files);
    e.target.value = "";
  };

  const handleEnterDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputRef.current) return;

    onSubmit(inputRef.current.value).then(() => {
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-2 flex items-center">
        <Button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="p-1"
          variant="icon"
        >
          <PlusCircle className="w-6 h-6 text-[#9d9d9e]" />
        </Button>
      </div>

      <Input
        ref={inputRef}
        type="text"
        onKeyDown={handleEnterDown}
        placeholder="Send a message"
        className="w-full px-11 py-2.5 rounded-lg bg-[#0e0e10]"
      />

      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="fileInput"
      />

      <div className="absolute right-2 inset-y-0 flex items-center">
        <Button className="p-1" variant="icon" onClick={handleSubmit}>
          <SendHorizonal className="w-6 h-6 text-[#9d9d9e]" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
