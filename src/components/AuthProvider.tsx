import { createContext, useContext, PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useSessionChecker from "../hooks/useSessionChecker";
import { removeTokens, setTokens, setupInterceptors, signIn } from "../api/api";

interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean | undefined;
  isNetworkError: boolean | undefined;
  handleSignIn: (login: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

interface AuthProviderProps extends PropsWithChildren {}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, isNetworkError, isUnauthorized } = useSessionChecker();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, []);

  const handleSignIn = async (login: string, password: string) => {
    try {
      const response = await signIn(login, password, null);
      setTokens(response);
      queryClient.invalidateQueries();
    } catch (err) {
      removeTokens();
      throw err;
    }
  };

  const handleLogout = async () => {
    // TODO: ask server to logout
    removeTokens();
    navigate("/sign-in", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !isUnauthorized,
        isNetworkError,
        handleSignIn,
        handleLogout,
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
