import { CornerUpLeft, Pencil, Trash } from "lucide-react";
import ContextMenu from "../../../../components/ContextMenu";
import { MessageSchema, MessageType } from "../../../../schemas/message";
import cn from "../../../../utils/cn";
import MessageAttachments from "./MessageAttachments";
import MessageStatus from "./MessageStatus";
import RepliedMessage from "./RepliedMessage";
import { useMessageDeleteModal } from "./MessageDeleteModal";
import { useEditContextMessage } from "../EditMessageProvider";
import { useReplyMessageContext } from "../ReplyMessageProvider";

function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

function getBubbleBorderRadius({
  forceLeftAlign,
  isOwnMessage,
  isFirstInGroup,
  isLastInGroup,
}: {
  forceLeftAlign: boolean;
  isOwnMessage: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}) {
  if (isFirstInGroup && isLastInGroup) {
    return "rounded-2xl";
  }

  if (forceLeftAlign) {
    return cn("rounded-2xl", {
      "rounded-bl-md": !isLastInGroup,
      "rounded-tl-md": !isFirstInGroup,
    });
  }

  if (isOwnMessage) {
    return cn("rounded-2xl", {
      "rounded-tr-md": !isFirstInGroup,
      "rounded-br-md": !isLastInGroup,
    });
  } else {
    return cn("rounded-2xl", {
      "rounded-bl-md": !isLastInGroup,
      "rounded-tl-md": !isFirstInGroup,
    });
  }
}

interface MessageCard {
  message: MessageSchema;
  maxReadAt: string;
  isOwnMessage: boolean;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
  forceLeftAlign: boolean;
}

const MessageCard = ({
  message,
  isOwnMessage,
  isLastInGroup,
  isFirstInGroup,
  forceLeftAlign,
  maxReadAt,
}: MessageCard) => {
  const deleteModal = useMessageDeleteModal();
  const replyMessageContext = useReplyMessageContext();
  const editMessageContext = useEditContextMessage();

  const borderRadius = getBubbleBorderRadius({
    forceLeftAlign,
    isOwnMessage,
    isFirstInGroup,
    isLastInGroup,
  });

  const contextMenuButtons = [
    {
      content: "Reply",
      onClick: () => replyMessageContext.set(message),
      icon: CornerUpLeft,
    },
    isOwnMessage
      ? {
          content: "Edit",
          onClick: () => editMessageContext.set(message),
          icon: Pencil,
        }
      : undefined,
    {
      content: "Delete",
      onClick: () => deleteModal.open(message),
      icon: Trash,
    },
  ].filter(isDefined);

  return (
    <div
      data-message-id={message.id}
      data-message-author-id={message.author.id}
      className={`flex w-full ${
        forceLeftAlign
          ? "justify-start"
          : isOwnMessage
            ? "justify-end"
            : "justify-start"
      }`}
    >
      <ContextMenu>
        <ContextMenu.Trigger asChild>
          <div
            className={`relative pl-2.5 pr-3 py-1.5 text-[#efeff1] text-sm ${
              isOwnMessage ? "bg-[#9147ff]" : "bg-[#1f1f23]"
            } ${borderRadius}`}
            style={{
              maxWidth: "min(90%, 28rem)",
            }}
          >
            {!isOwnMessage && isFirstInGroup && (
              <div className={`font-semibold leading-none`}>
                {message.author.globalName}
              </div>
            )}
            {message.type === MessageType.REPLY && (
              <RepliedMessage
                message={message.referencedMessage}
                isOwnMessage={isOwnMessage}
              />
            )}
            {message.attachments.length > 0 && (
              <MessageAttachments attachments={message.attachments} />
            )}
            {message.content.length === 0 ? (
              <div className="absolute bottom-0 right-1.5">
                <MessageStatus
                  message={message}
                  isOwnMessage={isOwnMessage}
                  maxReadAt={maxReadAt}
                />
              </div>
            ) : (
              <div className="break-words whitespace-pre-wrap">
                {message.content}
                <span className="relative float-right ml-1.5">
                  <MessageStatus
                    message={message}
                    isOwnMessage={isOwnMessage}
                    maxReadAt={maxReadAt}
                    className="opacity-0"
                  />
                  <div className="absolute top-1 left-1.5">
                    <MessageStatus
                      message={message}
                      isOwnMessage={isOwnMessage}
                      maxReadAt={maxReadAt}
                    />
                  </div>
                </span>
              </div>
            )}
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <div className="flex flex-col">
            {contextMenuButtons.map(({ onClick, icon: Icon, content }) => (
              <ContextMenu.Button onClick={onClick}>
                <Icon className="w-5 h-5" />
                <div>{content}</div>
              </ContextMenu.Button>
            ))}
          </div>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
};

export default MessageCard;
