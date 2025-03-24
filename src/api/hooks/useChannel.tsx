import { useQuery } from "@tanstack/react-query";
import { getChannel } from "../api";

const useChannel = (channelId: string | null) => {
  return useQuery({
    queryKey: ["/channels/{channelId}", channelId],
    queryFn: () => {
      if (channelId === null) return null;
      return getChannel(channelId);
    },
    enabled: channelId !== null,
    staleTime: 5 * 60 * 1000,
  });
};

export default useChannel;
