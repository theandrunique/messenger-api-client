import { PlusCircle, SendHorizonal } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { ChangeEvent, useLayoutEffect, useRef } from "react";
import Textarea from "../../../../components/ui/Textarea";
import "./input.css";
import Tooltip from "../../../../components/Tooltip";
import { useEditContextMessage } from "../EditMessageProvider";
import { useAttachmentsUploader } from "../AttachmentUploaderProvider";
import useMessageInputTextStore from "./useMessageInputTextStore";
import notifications from "../../../../utils/notifications";
import { ApiError } from "../../../../schemas/common";

interface MessageInputProps {
  onSubmit: (messageContent: string) => Promise<void>;
  channelId: string;
}

const MessageInput = ({ onSubmit, channelId }: MessageInputProps) => {
  const attachmentsUploader = useAttachmentsUploader();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editMessageContext = useEditContextMessage();

  const text = useMessageInputTextStore(
    (state) => state.content[channelId] ?? ""
  );
  const setText = useMessageInputTextStore((state) => state.set);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    attachmentsUploader.upload(files, channelId);
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

    onSubmit(textareaRef.current.value)
      .then(() => {
        setText(channelId, "");
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          notifications.error(err.message);
        } else {
          notifications.error("Something went wrong");
        }
      });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const clipboardItems = e.clipboardData.items;

    for (const item of clipboardItems) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) attachmentsUploader.upload([file], channelId);
        e.preventDefault();
        return;
      }
    }
  };

  useLayoutEffect(() => {
    setText(channelId, editMessageContext.message?.content ?? "");
  }, [editMessageContext.message]);

  useLayoutEffect(() => {
    requestAnimationFrame(adjustTextareaHeight);
  }, [text]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = 100;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className="relative w-full min-h-[44px]">
      <div className="absolute inset-y-0 left-2 flex items-center">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Button
              onClick={() => document.getElementById("fileInput")?.click()}
              className="p-1"
              variant="icon"
            >
              <PlusCircle className="w-6 h-6 text-[#9d9d9e]" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" align="start">
            Add an attachment
          </Tooltip.Content>
        </Tooltip>
      </div>

      <div className="flex items-center h-full">
        <Textarea
          onPaste={handlePaste}
          ref={textareaRef}
          value={text}
          onKeyDown={handleEnterDown}
          onChange={(e) => {
            setText(channelId, e.target.value);
          }}
          placeholder="Send a message"
          className="w-full px-11 py-2.5 rounded-lg bg-[#0e0e10] resize-none overflow-y-auto scrollbar-transparent h-full align-middle placeholder:align-middle"
          style={{
            minHeight: "44px",
            maxHeight: "100px",
          }}
          rows={1}
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
