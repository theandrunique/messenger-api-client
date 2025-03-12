import { create } from "zustand";
import api from "../api/api";
import { TokenPairSchema } from "../schemas/auth";
import { UserSchema } from "../schemas/user";

const refreshSession = async (): Promise<TokenPairSchema | null> => {
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

interface AuthStore {
  checkAuth: () => Promise<void>;
  signIn: (login: string, password: string) => Promise<void>;
  updateUser: () => Promise<void>;
  isCheckingAuth: boolean;
  currentUser: UserSchema | null;
  accessToken: string | null;
}

const useAuthStore = create<AuthStore>((set, get) => ({
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

      set({ accessToken: tokenPair.accessToken });

      const currentUser = await api.getMe();
      set({ currentUser: currentUser });
      setTimeout(() => get().checkAuth(), tokenPair.expiresIn * 1000);
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

  updateUser: async () => {
    const user = await api.getMe();
    set({ currentUser: user });
  },
}));

export default useAuthStore;
