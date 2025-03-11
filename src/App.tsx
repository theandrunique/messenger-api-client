import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Messenger from "./pages/Messenger";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import FullScreenLoading from "./components/FullScreenLoading";
import Settings from "./pages/Settings";

function App() {
  const { checkAuth, isCheckingAuth, currentUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <FullScreenLoading />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to="/messenger" />
          ) : (
            <Navigate to="/sign-in" />
          )
        }
      />
      <Route
        path="/settings"
        element={currentUser ? <Settings /> : <Navigate to="/sign-in" />}
      />
      <Route
        path="/messenger"
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
  );
}

export default App;
