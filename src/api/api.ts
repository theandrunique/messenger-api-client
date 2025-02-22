import axios, { AxiosInstance } from "axios";
import {
  Channel,
  MessageSchema,
  ServiceError,
  TokenPair,
  User,
} from "../entities";

const apiUrl = "http://localhost:8000";

class ApiClient {
  axiosInstance: AxiosInstance;
  accessToken: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
    });
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (this.accessToken) {
          config.headers["Authorization"] = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getCurrentSavedTokenPair(): Promise<TokenPair | null> {
    try {
      const sessionInfo =
        await this.axiosInstance.get<TokenPair>("/auth/token");
      return sessionInfo.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return null;
      }
      throw new Error(`Unexpected error has occurred: ${err}`);
    }
  }

  async refreshSession(session: TokenPair): Promise<TokenPair | null> {
    try {
      const response = await this.axiosInstance.postForm<TokenPair>(
        "/auth/token",
        {
          refreshToken: session.refreshToken,
        }
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return null;
      }
      throw new Error(`Unexpected error has occurred: ${err}`);
    }
  }

  async signIn(login: string, password: string): Promise<TokenPair> {
    try {
      const response = await this.axiosInstance.postForm<TokenPair>(
        "/auth/sign-in",
        {
          login: login,
          password: password,
          captchaToken: "kdsj",
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        throw new ServiceError(data.code, data.message, data.errors);
      }
      throw new Error("Something went wrong");
    }
  }

  async singUp(
    username: string,
    email: string,
    globalName: string,
    password: string
  ): Promise<User> {
    try {
      const response = await this.axiosInstance.postForm<User>(
        "/auth/sign-up",
        {
          username: username,
          email: email,
          globalName: globalName,
          password: password,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        throw new ServiceError(data.code, data.message, data.errors);
      }
      throw new Error("Something went wrong");
    }
  }

  async getMe(): Promise<User> {
    const response = await this.axiosInstance.get<User>("/users/@me");
    return response.data;
  }

  async getUserChannels(): Promise<Channel[]> {
    const response = await this.axiosInstance.get<Channel[]>(
      "/users/@me/channels"
    );
    return response.data;
  }

  async getMessages(
    channelId: string,
    before: string | null,
    limit: number | null
  ): Promise<MessageSchema[]> {
    const response = await this.axiosInstance.get<MessageSchema[]>(
      `/channels/${channelId}/messages`,
      {
        params: { before, limit },
      }
    );
    return response.data;
  }
}

const api = new ApiClient();

export default api;
