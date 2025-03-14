import { PropsWithChildren } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";
import FullScreenLoading from "./FullScreenLoading";

interface ProtectedRouteProps extends PropsWithChildren {}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isNetworkError } = useAuth();

  if (isLoading) return <FullScreenLoading />;

  if (isNetworkError) {
    return (
      <div>
        <h1>Network error</h1>
        <p>Check your internet connection and try again.</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  return children;
};

export default ProtectedRoute;
