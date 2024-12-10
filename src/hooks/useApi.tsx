import { useEffect, useState } from "react";
import { ApiClient } from "../api/api";
import { TokenPair } from "../entities";
import { useLocation, useNavigate } from "react-router-dom";
import useNextLocationParam from "./useNextLocaionParam";

const useApi = () => {
  const [tokens, setTokens] = useState<TokenPair | null>(null);
  const [api] = useState(() => new ApiClient());
  const location = useLocation();
  const navigate = useNavigate();
  const nextLocation = useNextLocationParam();

  const refreshSession = async () => {
    try {
      const tokenPair = await api.refreshSession();
      if (tokenPair !== null) {
        api.setToken(tokenPair.accessToken);
        setTokens(tokenPair);
        setTimeout(refreshSession, tokenPair.expiresIn * 1000);

        navigate(nextLocation || "/", { replace: true });
      } else {
        throw new Error("Session is invalid");
      }
    } catch {
      if (
        location.pathname === "/sign-in" ||
        location.pathname === "/sign-up"
      ) {
        return;
      }

      const fullPath = encodeURIComponent(location.pathname + location.search);
      navigate(`/sign-in?next=${fullPath}`);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const checkSession = async () => {
    try {
      await api.getMe();
    } catch {
      setTokens(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, [tokens]);

  return {
    api,
    setTokens,
  };
};

export default useApi;
