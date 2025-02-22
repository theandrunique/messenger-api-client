import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { QueryClient, QueryClientProvider } from "react-query";
import Messenger from "./pages/Messenger";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import FullScreenLoading from "./components/FullScreenLoading";

const queryClient = new QueryClient();

function App() {
  const { checkAuth, isCheckingAuth, currentUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <FullScreenLoading />;

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Messenger /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/sign-in"
          element={!currentUser ? <SignInPage /> : <Navigate to="/" />}
        />
        <Route
          path="/sign-up"
          element={!currentUser ? <SignUpPage /> : <Navigate to="/" />}
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
