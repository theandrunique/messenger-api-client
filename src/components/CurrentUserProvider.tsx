import { createContext, useEffect } from "react";
import { UserSchema } from "../schemas/user";
import useCurrentUser from "../api/hooks/useCurrentUser";
import FullScreenLoading from "./FullScreenLoading";

interface CurrentUserContextType {
  currentUser: UserSchema;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
);

const CurrentUserProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (currentUser) localStorage.setItem("userId", currentUser.id);
  }, [currentUser]);

  if (!currentUser || isLoading) {
    return <FullScreenLoading message="Fetching info about you" />;
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;

export const useCurrentUserId = () => {
  const v =  localStorage.getItem("userId");

  if (!v) {
    throw new Error("useCurrentUserId must be used with in CurrentUserProvider");
  }

  return v;
};
