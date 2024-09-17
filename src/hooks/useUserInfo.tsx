import { useQuery } from "react-query";
import { User } from "../entities";
import useApi from "./useApi";


export default function useUserInfo(): User | undefined {
    const { api } = useApi();

    const user = useQuery<User>({
        queryKey: ["user"],
        queryFn: () => api.getMe()
    });

    return user.data;
}
