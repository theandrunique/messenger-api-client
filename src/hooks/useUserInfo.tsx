import { useQuery } from "react-query";
import { User } from "../entities";
import api from "../api/api";

export default function useUserInfo(): User | undefined {
  const user = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => api.getMe(),
  });

  return user.data;
}
