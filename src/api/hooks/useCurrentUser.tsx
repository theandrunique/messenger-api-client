import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";

const useCurrentUser = () => {
  const context = useQuery({
    queryKey: ["/users/@me"],
    queryFn: getMe,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    currentUser: context.data,
    ...context
  }
};

export default useCurrentUser;
