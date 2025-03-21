import { useQuery } from "@tanstack/react-query";
import { refreshSessionIfNeed } from "../api/api";

const useSessionChecker = () => {
  const context = useQuery({
    queryKey: ["session-checker"],
    queryFn: refreshSessionIfNeed,
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const isNetworkError = context.error?.message === "network-error";
  const isUnauthorized = context.error?.message === "no-session"
    || context.error?.message === "session-error";

  return {
    recheckSession: context.refetch,
    isNetworkError,
    isUnauthorized,
    ...context,
  }
};

export default useSessionChecker;
