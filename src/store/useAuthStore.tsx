import { create } from "zustand";
import api from "../api/api";
import { TokenPair, User } from "../entities";

const refreshSession = async (): Promise<TokenPair | null> => {
  const savedTokenPair = await api.getCurrentSavedTokenPair();
  if (savedTokenPair === null) {
    console.log("No session was found");
    return null;
  }

  const expiresAt = new Date(savedTokenPair.issuedAt);
  expiresAt.setSeconds(expiresAt.getSeconds() + savedTokenPair.expiresIn);

  if (expiresAt < new Date()) {
    console.log("Session is expired and need to be refreshed");
    return await api.refreshSession(savedTokenPair);
  }

  return savedTokenPair;
};

interface AuthStoreState {
  checkAuth: () => Promise<void>;
  signIn: (login: string, password: string) => Promise<void>;
  isCheckingAuth: boolean;
  currentUser: User | null;
}

const useAuthStore = create<AuthStoreState>((set, get) => ({
  currentUser: null,
  accessToken: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const tokenPair = await refreshSession();
      if (tokenPair === null) {
        set({ currentUser: null, isCheckingAuth: false });
        return;
      }

      api.setAccessToken(tokenPair.accessToken);

      const currentUser = await api.getMe();
      set({ currentUser: currentUser });
    } catch (err) {
      console.error("Error checking auth: ", err);
      set({ currentUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signIn: async (login: string, password: string) => {
    await api.signIn(login, password);
    get().checkAuth();
  },
}));

export default useAuthStore;
