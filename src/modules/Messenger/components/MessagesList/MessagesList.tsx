import { ChannelSchema } from "../../../../schemas/channel";
import { MessageSchema } from "../../../../schemas/message";
import MessageCard from "../MessageCard";
import DateDivider from "./DateDivider";

const groupMessagesByAuthor = (
  messages: MessageSchema[]
): MessageSchema[][] => {
  if (messages.length === 0) return [];

  const groups: MessageSchema[][] = [];
  let currentGroup: MessageSchema[] = [messages[0]];
  let currentAuthorId = messages[0].author.id;

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i];
    if (message.author.id === currentAuthorId) {
      currentGroup.push(message);
    } else {
      groups.push(currentGroup);
      currentGroup = [message];
      currentAuthorId = message.author.id;
    }
  }

  groups.push(currentGroup);
  return groups;
};

const groupMessagesByDate = (messages: MessageSchema[]) => {
  const groupedMessagesByDate = messages.reduce(
    (acc, message) => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);
      return acc;
    },
    {} as Record<string, typeof messages>
  );
  return Object.entries(groupedMessagesByDate);
};

interface MessagesListProps {
  messages: MessageSchema[];
  channel: ChannelSchema;
  bottomRef?: React.RefObject<HTMLDivElement>;
}

const MessagesList = ({ messages, channel, bottomRef }: MessagesListProps) => {
  const messageGroupsByDate = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col-reverse">
      <div ref={bottomRef}></div>
      {messageGroupsByDate.map(([date, messages]) => {
        const authorGroups = groupMessagesByAuthor(messages);

        return (
          <div key={date}>
            <DateDivider timestamp={messages[0].timestamp} />
            <div className="flex flex-col-reverse">
              {authorGroups.map((group) =>
                group.map((message, index) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    channelType={channel.type}
                    lastReadAt={channel.maxReadAt as string}
                    showAvatar={index === 0}
                    showUsername={index === group.length - 1}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
