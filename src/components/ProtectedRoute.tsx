import { PropsWithChildren } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";
import FullScreenLoading from "./FullScreenLoading";

interface ProtectedRouteProps extends PropsWithChildren {}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isNetworkError } = useAuth();

  if (isLoading) return <FullScreenLoading message="Trying to restore your session" />;

  if (isNetworkError) {
    return (
      <FullScreenLoading message="Network error">
        <p>Please check your internet connection and try again</p>
      </FullScreenLoading>
    );
  }

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  return children;
};

export default ProtectedRoute;
