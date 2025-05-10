import { useLayoutEffect, useRef, useState } from "react";
import { ChannelSchema } from "../../../../schemas/channel";
import { MessageSchema } from "../../../../schemas/message";
import { isMetaMessage } from "../MessageCard/utils.ts";
import MessageGroup from "../MessageGroup/MessageGroup.tsx";
import DateDivider from "./DateDivider";
import MessageDeleteModal from "../MessageCard/MessageDeleteModal.tsx";

const groupMessagesByAuthor = (
  messages: MessageSchema[]
): MessageSchema[][] => {
  if (messages.length === 0) return [];

  const groups: MessageSchema[][] = [];
  let currentGroup: MessageSchema[] = [messages[0]];
  let currentAuthorId = messages[0].author.id;
  let currentIsMeta = isMetaMessage(messages[0].type);

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i];
    const isMeta = isMetaMessage(message.type);

    if (
      isMeta !== currentIsMeta ||
      (!isMeta && message.author.id !== currentAuthorId)
    ) {
      groups.push(currentGroup);
      currentGroup = [message];
      currentAuthorId = message.author.id;
      currentIsMeta = isMeta;
    } else {
      currentGroup.push(message);
    }
  }

  groups.push(currentGroup);
  return groups;
};

const groupMessagesByDate = (messages: MessageSchema[]) => {
  const groupedMessagesByDate = messages.reduce<
    Record<string, MessageSchema[]>
  >((acc, message) => {
    const dateKey = new Date(message.timestamp).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {});
  return Object.entries(groupedMessagesByDate);
};

interface MessagesListProps {
  messages: MessageSchema[];
  channel: ChannelSchema;
  bottomRef?: React.RefObject<HTMLDivElement>;
}

const MessagesList = ({ messages, channel, bottomRef }: MessagesListProps) => {
  const [isWideLayout, setIsWideLayout] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setIsWideLayout(width > 800);
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const messageGroupsByDate = groupMessagesByDate(messages);

  return (
    <>
      <div className="flex flex-col-reverse gap-2 mt-2" ref={containerRef}>
        <div ref={bottomRef}></div>
        {messageGroupsByDate.map(([date, messages]) => {
          const authorGroups = groupMessagesByAuthor(messages);

          return (
            <div key={date}>
              <DateDivider timestamp={messages[0].timestamp} />
              <div className="flex flex-col-reverse gap-2">
                {authorGroups.map((group) => (
                  <MessageGroup
                    messages={group}
                    channel={channel}
                    isWideLayout={isWideLayout}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <MessageDeleteModal />
    </>
  );
};

export default MessagesList;
