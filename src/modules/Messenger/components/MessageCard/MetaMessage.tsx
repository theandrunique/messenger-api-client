import ChannelImage from "../../../../components/ChannelImage.tsx";
import { MessageSchema, MessageType } from "../../../../schemas/message";
import { renderMetaMessageText } from "./utils.tsx";

const MetaMessage = ({ message }: { message: MessageSchema }) => {
  return (
    <div
      data-message-id={message.id}
      data-message-author-id={message.author.id}
      className="text-center text-sm text-[#efeff1] my-2"
    >
      {message.type === MessageType.CHANNEL_IMAGE_CHANGE ? (
        <div className="flex flex-col items-center gap-2">
          <div className="opacity-50">{renderMetaMessageText(message)}</div>
          <ChannelImage
            channelId={message.channelId}
            image={message.metadata.newImage}
            className="w-24 h-24"
            channelName={""}
          />
        </div>
      ) : (
        <div className="opacity-50">{renderMetaMessageText(message)}</div>
      )}
    </div>
  );
};

export default MetaMessage;
