import axios, { AxiosInstance } from "axios";
import {
  RefreshTokenResponse,
  ServiceError,
  TokenPair,
  User,
} from "../entities";

const apiUrl = "http://localhost:8000";

export class ApiClient {
  private accessToken: string | null = null;
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers["Authorization"] = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setToken(token: string) {
    this.accessToken = token;
  }

  async refreshSession(): Promise<TokenPair | null> {
    const token =
      await this.axiosInstance.get<string>("/auth/token");

    if (token.data === null) return null;

    const response = await this.axiosInstance.postForm<TokenPair>(
      "/auth/token",
      {
        refreshToken: token.data,
      }
    );
    return response.data;
  }

  async signIn(
    login: string,
    password: string,
    captchaToken: string
  ): Promise<TokenPair> {
    try {
      const response = await this.axiosInstance.postForm<TokenPair>(
        "/auth/sign-in",
        {
          login: login,
          password: password,
          captchaToken: captchaToken,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        throw new ServiceError(data.title, data.errors);
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
        throw new ServiceError(data.title, data.errors);
      }
      throw new Error("Something went wrong");
    }
  }

  async getMe(): Promise<User> {
    const response = await this.axiosInstance.get<User>("/users/me");
    return response.data;
  }
}
