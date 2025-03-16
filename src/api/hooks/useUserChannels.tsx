import { QueryClient, useQuery } from "@tanstack/react-query";
import { getChannels } from "../api";
import {
  ChannelCreateEventSchema,
  MessageCreateEventSchema,
} from "../../schemas/gateway";
import { ChannelSchema } from "../../schemas/channel";

const useUserChannels = () => {
  const context = useQuery({
    queryKey: ["/users/@me/channels"],
    queryFn: getChannels,
    staleTime: 5 * 60 * 1000,
  });

  return context;
};

export default useUserChannels;

export const updateUseUserChannelsOnNewMessage = (
  queryClient: QueryClient,
  event: MessageCreateEventSchema
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      const message = event.payload;

      return oldChannels.map((channel) => 
        channel.id === event.payload.channelId
          ? {
              ...channel,
              lastMessage: {
                id: message.id,
                authorId: message.author.id,
                authorUsername: message.author.username,
                authorGlobalName: message.author.globalName,
                content: message.content,
                timestamp: message.timestamp,
                editedTimestamp: message.editedTimestamp,
                attachmentsCount: message.attachments.length,
              },
              lastMessageTimestamp: event.payload.timestamp,
            }
          : channel
      );
    }
  );
};

export const updateUseUserChannelsOnNewChannel = (
  queryClient: QueryClient,
  event: ChannelCreateEventSchema
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      return [...oldChannels, event.payload];
    }
  );
};
