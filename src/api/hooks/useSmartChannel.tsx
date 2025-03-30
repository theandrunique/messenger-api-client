import useChannel from "./useChannel";
import useUserChannels from "./useUserChannels";

const useSmartChannel = (channelId: string | undefined) => {
  const userChannelsQuery = useUserChannels();
  const userChannel = userChannelsQuery.data?.find((c) => c.id === channelId);

  const shouldFetchChannel = !userChannel;

  const channelQuery = useChannel(
    shouldFetchChannel ? channelId || null : null
  );

  return {
    data: userChannel ?? channelQuery.data,
    isPending: userChannelsQuery.isPending || (shouldFetchChannel && channelQuery.isPending),
    isError: userChannelsQuery.isError || channelQuery.isError,
    error: channelQuery.error,
    isCached: !!userChannel,
  };
};

export default useSmartChannel;
