import { createContext, useContext } from "react";
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

export const useLoadedCurrentUser = () => {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error(
      "useLoadedCurrentUser must be used within CurrentUserProvider"
    );
  }

  return context.currentUser;
};

export const useCurrentUserId = () => {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentUserId must be used within CurrentUserProvider");
  }

  return context.currentUser.id;
};
