import { useQuery } from "react-query";
import { Channel } from "../entities";
import api from "../api/api";

export default function useChannels(): Channel[] | undefined {
  const channels = useQuery<Channel[]>({
    queryKey: ["user-channels"],
    queryFn: () => api.getUserChannels(),
  });

  return channels.data;
}
