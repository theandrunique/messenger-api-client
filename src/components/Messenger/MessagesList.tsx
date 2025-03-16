import { ChannelType } from "../../schemas/channel";
import { MessageSchema } from "../../schemas/message";
import MessageCard from "./MessageCard";

interface DateDividerProps {
  date: Date;
}

const getDateString = (timestamp: Date): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const DateDivider = ({ date }: DateDividerProps) => {
  return (
    <div className="flex w-auto items-center justify-center rounded-full sticky top-0 z-10">
      <div className="px-4 mb-1 opacity-90 p-0.5 bg-[#374151] rounded-full text-white text-sm font-semibold">
        {getDateString(date)}
      </div>
    </div>
  );
};

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
  channelType: ChannelType;
}

const MessagesList = ({ messages, channelType }: MessagesListProps) => {
  const messageGroupsByDate = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col-reverse">
      {messageGroupsByDate.map(([date, messages]) => {
        const authorGroups = groupMessagesByAuthor(messages);

        return (
          <div key={date}>
            <DateDivider date={messages[0].timestamp} />
            <div className="flex flex-col-reverse">
              {authorGroups.map((group) =>
                group.map((message, index) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    channelType={channelType}
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
