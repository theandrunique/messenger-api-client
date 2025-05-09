import { createContext, useContext, PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useSessionChecker from "../hooks/useSessionChecker";
import {
  removeTokens,
  setTokens,
  setupInterceptors,
  signIn,
  signOut,
} from "../api/api";

interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean | undefined;
  isNetworkError: boolean | undefined;
  handleSignIn: (
    login: string,
    password: string,
    totp?: string
  ) => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

interface AuthProviderProps extends PropsWithChildren {}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, isNetworkError, isUnauthorized } = useSessionChecker();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const onRefreshError = () => {
    console.log("Refresh session error callback...");
    removeTokens();
    navigate("/sign-in", { replace: true });
    queryClient.invalidateQueries();
  };

  useEffect(() => {
    setupInterceptors(onRefreshError);
  }, []);

  const handleSignIn = async (
    login: string,
    password: string,
    totp?: string
  ) => {
    try {
      const response = await signIn(login, password, totp);
      setTokens(response);
      queryClient.invalidateQueries();
    } catch (err) {
      removeTokens();
      throw err;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    removeTokens();
    queryClient.clear();
    navigate("/sign-in", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !isUnauthorized,
        isNetworkError,
        handleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
