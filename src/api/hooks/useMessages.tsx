import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { getMessages } from "../api";
import { MessageSchema } from "../../schemas/message";
import {
  MessageCreateEventSchema,
  MessageUpdateEventSchema,
} from "../../schemas/gateway";

const limit = 50;

const useMessages = (channelId: string | null) => {
  const context = useInfiniteQuery<MessageSchema[], Error>({
    queryKey: ["/channels/{channelId}/messages", channelId],
    queryFn: async ({ pageParam }) => {
      if (!channelId) return [];

      const messages = await getMessages(
        channelId,
        pageParam as string | null,
        limit.toString()
      );
      return messages;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.length < limit ? null : lastPage[lastPage.length - 1].id,
    enabled: !!channelId,
    staleTime: 10 * 60 * 1000,
  });

  return {
    messages: context.data?.pages.flatMap((page) => page) || [],
    ...context,
  };
};

export default useMessages;

export const updateUseMessagesOnMessageCreate = (
  queryClient: QueryClient,
  event: MessageCreateEventSchema
) => {
  queryClient.setQueryData(
    ["/channels/{channelId}/messages", event.message.channelId],
    (oldData: InfiniteData<MessageSchema[]> | undefined) => {
      if (!oldData) return;

      const isAlreadyExists = oldData.pages.some((page) =>
        page.some((message) => message.id === event.message.id)
      );

      if (isAlreadyExists) return oldData;

      return {
        pageParams: oldData.pageParams,
        pages: [
          [event.message, ...oldData.pages[0]],
          ...oldData.pages.slice(1),
        ],
      };
    }
  );
};

export const updateUseMessagesOnMessageUpdate = (
  queryClient: QueryClient,
  event: MessageUpdateEventSchema
) => {
  queryClient.setQueryData(
    ["/channels/{channelId}/messages", event.message.channelId],
    (oldData: InfiniteData<MessageSchema[]> | undefined) => {
      if (!oldData) return;

      const message = oldData.pages.find((page) =>
        page.some((message) => message.id === event.message.id)
      );
      // message was updated but it's not fetched yet
      if (!message) return;

      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((message) =>
            message.id === event.message.id ? event.message : message
          )
        ),
      };
    }
  );
};
