import { QueryClient, useQuery } from "@tanstack/react-query";
import { getChannels } from "../api";
import {
  ChannelMemberAddEventSchema,
  ChannelMemberRemoveEventSchema,
  ChannelUpdateEventSchema,
  MessageAckEventSchema,
  MessageCreateEventSchema,
} from "../../schemas/gateway";
import { ChannelSchema } from "../../schemas/channel";
import { MessageSchema } from "../../schemas/message";

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
  message: MessageSchema
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      return oldChannels.map((channel) =>
        channel.id === message.channelId
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
              lastMessageTimestamp: message.timestamp,
            }
          : channel
      );
    }
  );
};

export const updateUseUserChannelsOnNewChannel = (
  queryClient: QueryClient,
  channel: ChannelSchema
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      const isAlreadyExists = oldChannels.some(
        (oldChannel) => oldChannel.id === channel.id
      );
      if (isAlreadyExists) return oldChannels;

      return [...oldChannels, channel];
    }
  );
};

export const updateUseUserChannelOnChannelUpdate = (
  queryClient: QueryClient,
  event: ChannelUpdateEventSchema
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      return oldChannels.map((oldChannel) =>
        oldChannel.id === event.channel.id ? event.channel : oldChannel
      );
    }
  );
};

export const updateUseUserChannelOnMemberRemove = (
  queryClient: QueryClient,
  event: ChannelMemberRemoveEventSchema,
  currentUserId: string
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      if (event.user.id === currentUserId) {
        return oldChannels.filter((channel) => channel.id !== event.channelId);
      }

      return oldChannels.map((channel) =>
        channel.id === event.channelId
          ? {
              ...channel,
              members: channel.members.filter(
                (member) => member.id !== event.user.id
              ),
            }
          : channel
      );
    }
  );
};

export const updateUseUserChannelOnMemberAdd = (
  queryClient: QueryClient,
  event: ChannelMemberAddEventSchema,
  currentUserId: string
) => {
  if (event.user.id === currentUserId) {
    queryClient.invalidateQueries({ queryKey: ["/users/@me/channels"] });
    return;
  }

  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      return oldChannels.map((channel) =>
        channel.id === event.channelId
          ? {
              ...channel,
              members: channel.members.some(
                (member) => member.id === event.user.id
              )
                ? channel.members
                : [...channel.members, event.user],
            }
          : channel
      );
    }
  );
};

const compareIds = (a: string, b: string) => (BigInt(a) > BigInt(b) ? a : b);

export const updateUseUserChannelOnMessageAck = (
  queryClient: QueryClient,
  event: MessageAckEventSchema,
  currentUserId: string
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      if (currentUserId === event.memberId) {
        return oldChannels.map((channel) =>
          channel.id === event.channelId
            ? {
                ...channel,
                readAt: compareIds(channel.readAt, event.messageId),
              }
            : channel
        );
      } else {
        return oldChannels.map((channel) =>
          channel.id === event.channelId
            ? {
                ...channel,
                maxReadAt: compareIds(
                  channel.maxReadAt as string,
                  event.messageId
                ),
              }
            : channel
        );
      }
    }
  );
};
