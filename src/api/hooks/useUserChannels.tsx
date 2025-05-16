import { QueryClient, useQuery } from "@tanstack/react-query";
import { getChannels } from "../api";
import { ChannelSchema } from "../../schemas/channel";
import { compareIds, selectBiggest } from "../../utils";
import {
  ChannelMemberAddEventSchema,
  ChannelMemberRemoveEventSchema,
  ChannelUpdateEventSchema,
  MessageAckEventSchema,
} from "../../gateway/types";
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

export const updateUseUserChannelsOnNewLastMessage = (
  queryClient: QueryClient,
  newLastMessage: MessageSchema,
  force: boolean = false
) => {
  queryClient.setQueryData(
    ["/users/@me/channels"],
    (oldChannels: ChannelSchema[] | undefined) => {
      if (!oldChannels) return;

      return oldChannels.map((channel) => {
        if (channel.id !== newLastMessage.channelId) return channel;

        const currentLastMessage = channel.lastMessage;

        const shouldUpdate =
          force ||
          !currentLastMessage ||
          newLastMessage.id === currentLastMessage.id ||
          compareIds(newLastMessage.id, currentLastMessage.id);

        if (!shouldUpdate) return channel;

        return {
          ...channel,
          lastMessage: {
            id: newLastMessage.id,
            author: newLastMessage.author,
            targetUser: newLastMessage.targetUser,
            content: newLastMessage.content,
            timestamp: newLastMessage.timestamp,
            editedTimestamp: newLastMessage.editedTimestamp,
            attachmentsCount: newLastMessage.attachments.length,
            type: newLastMessage.type,
            metadata: newLastMessage.metadata,
          },
        };
      });
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
        oldChannel.id === event.channel.id
          ? {
              ...event.channel,
              lastReadMessageId: oldChannel.lastReadMessageId,
              maxReadMessageId: oldChannel.maxReadMessageId,
            }
          : oldChannel
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
                lastReadMessageId: selectBiggest(
                  channel.lastReadMessageId,
                  event.messageId
                ),
              }
            : channel
        );
      } else {
        return oldChannels.map((channel) =>
          channel.id === event.channelId
            ? {
                ...channel,
                maxReadMessageId: selectBiggest(
                  channel.maxReadMessageId,
                  event.messageId
                ),
              }
            : channel
        );
      }
    }
  );
};
