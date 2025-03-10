import axios, { AxiosInstance } from "axios";
import { TokenPairSchema } from "../schemas/auth.schema";
import { ApiError } from "../schemas/common.schema";
import { UserSchema } from "../schemas/user.schema";
import { ChannelSchema } from "../schemas/channel.schema";
import {
  CloudAttachmentCreateSchema as CloudAttachmentRequestSchema,
  CloudAttachmentResponseSchema,
  MessageAttachmentUploadSchema,
  MessageSchema,
} from "../schemas/message.schema";

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

  async getCurrentSavedTokenPair(): Promise<TokenPairSchema | null> {
    try {
      const sessionInfo =
        await this.axiosInstance.get<TokenPairSchema>("/auth/token");
      return sessionInfo.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return null;
      }
      throw err;
    }
  }

  async refreshSession(
    session: TokenPairSchema
  ): Promise<TokenPairSchema | null> {
    try {
      const response = await this.axiosInstance.postForm<TokenPairSchema>(
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
      throw err;
    }
  }

  async signIn(login: string, password: string): Promise<TokenPairSchema> {
    try {
      const response = await this.axiosInstance.postForm<TokenPairSchema>(
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
        throw new ApiError(data.code, data.message, data.errors);
      }
      throw error;
    }
  }

  async singUp(
    username: string,
    email: string,
    globalName: string,
    password: string
  ): Promise<UserSchema> {
    try {
      const response = await this.axiosInstance.postForm<UserSchema>(
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
        throw new ApiError(data.code, data.message, data.errors);
      }
      throw error;
    }
  }

  async getMe(): Promise<UserSchema> {
    const response = await this.axiosInstance.get<UserSchema>("/users/@me");
    return response.data;
  }

  async getUserChannels(): Promise<ChannelSchema[]> {
    const response = await this.axiosInstance.get<ChannelSchema[]>(
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

  async createAttachments(
    channelId: string,
    attachments: CloudAttachmentRequestSchema[]
  ): Promise<CloudAttachmentResponseSchema[]> {
    try {
      const response = await this.axiosInstance.post<
        CloudAttachmentResponseSchema[]
      >(`/channels/${channelId}/attachments`, {
        files: attachments,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        throw new ApiError(data.code, data.message, data.errors);
      }
      throw error;
    }
  }

  async postMessage(
    channelId: string,
    content: string,
    attachments: MessageAttachmentUploadSchema[]
  ): Promise<MessageSchema> {
    const response = await this.axiosInstance.post<MessageSchema>(
      `/channels/${channelId}/messages`,
      {
        content,
        attachments,
      }
    );

    return response.data;
  }

  async uploadFile(uploadUrl: string, file: File): Promise<void> {
    return await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      transformRequest: [(data) => data],
    });
  }

  async removeAvatar(): Promise<void> {
    await this.axiosInstance.delete("/users/@me/avatar");
  }

  async updateAvatar(file: File): Promise<void> {
    var formData = new FormData();
    formData.append("file", file)

    await this.axiosInstance.put("/users/@me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
  }
}

const api = new ApiClient();

export default api;
