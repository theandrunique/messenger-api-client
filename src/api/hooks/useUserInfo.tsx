import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api";

const useUserInfo = (userId: string | null) => {
  return useQuery({
    queryKey: ["/users/", userId],
    queryFn: () => {
      if (!userId) return;

      return getUser(userId);
    },
    enabled: userId !== null,
  })
};

export default useUserInfo;
