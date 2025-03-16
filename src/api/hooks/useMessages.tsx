import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { getMessages } from "../api";
import { MessageSchema } from "../../schemas/message";
import { MessageCreateEventSchema } from "../../schemas/gateway";

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

export const updateUseMessagesOnNewMessage = (
  queryClient: QueryClient,
  event: MessageCreateEventSchema
) => {
  queryClient.setQueryData(
    ["/channels/{channelId}/messages", event.payload.channelId],
    (oldData: InfiniteData<MessageSchema[]> | undefined) => {
      if (!oldData) return;

      const isAlreadyExists = oldData.pages.some((page) => 
        page.some((message) => message.id === event.payload.id)
      );

      if (isAlreadyExists) return oldData;

      return {
        pageParams: oldData.pageParams,
        pages: [
          [event.payload, ...oldData.pages[0]],
          ...oldData.pages.slice(1),
        ],
      };
    }
  );
};
