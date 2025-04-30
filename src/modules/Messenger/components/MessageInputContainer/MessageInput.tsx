import { PlusCircle, SendHorizonal } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { ChangeEvent, useRef } from "react";
import { useMessageAttachmentsUploader } from "../MessageAttachmentsUploader";
import Textarea from "../../../../components/ui/Textarea";
import "./input.css"

interface MessageInputProps {
  onSubmit: (messageContent: string) => Promise<void>;
}

const MessageInput = ({ onSubmit }: MessageInputProps) => {
  const { onFilesSelect } = useMessageAttachmentsUploader();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (!textareaRef.current) return;

    onSubmit(textareaRef.current.value).then(() => {
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }
    });
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = 100;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  // Обработчик изменения содержимого textarea
  const handleChange = () => {
    adjustTextareaHeight();
  };

  return (
    <div className="relative w-full min-h-[44px]">
      <div className="absolute inset-y-0 left-2 flex items-center">
        <Button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="p-1"
          variant="icon"
        >
          <PlusCircle className="w-6 h-6 text-[#9d9d9e]" />
        </Button>
      </div>

      <div className="flex items-center h-full">
        <Textarea
          ref={textareaRef}
          onKeyDown={handleEnterDown}
          onChange={handleChange}
          placeholder="Send a message"
          className="w-full px-11 py-2.5 rounded-lg bg-[#0e0e10] resize-none overflow-y-auto scrollbar-transparent h-full align-middle placeholder:align-middle"
          style={{
            minHeight: "44px",
            maxHeight: "100px",
          }}
          rows={1} // Начальное количество строк
        />
      </div>

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
