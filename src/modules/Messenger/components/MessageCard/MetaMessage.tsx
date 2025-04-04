import { MessageSchema, MessageType } from "../../../../schemas/message";


const MetaMessage = ({ message }: { message: MessageSchema }) => {
  return (
    <div
      data-message-id={message.id}
      data-message-author-id={message.author.id}
      className="text-center text-sm text-[#efeff1] opacity-50 my-2"
    >
      {message.type === MessageType.MEMBER_ADD &&
        `${message.author.username} added ${message.targetUser?.username}`}
      {message.type === MessageType.MEMBER_REMOVE &&
        `${message.author.username} removed ${message.targetUser?.username}`}
      {message.type === MessageType.MEMBER_LEAVE &&
        `${message.author.username} left the chat`}
      {message.type === MessageType.CHANNEL_TITLE_CHANGE &&
        `Channel name changed to "${message.metadata.newTitle}" by ${message.author.username}`}
      {message.type === MessageType.CHANNEL_IMAGE_CHANGE &&
        `Channel image updated`}
      {message.type === MessageType.CHANNEL_PINNED_MESSAGE &&
        `A message was pinned`}
      {message.type === MessageType.CHANNEL_UNPIN_MESSAGE &&
        `A message was unpinned`}
    </div>
  )
};

export default MetaMessage;
