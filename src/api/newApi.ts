import axios, { AxiosResponse } from "axios";
import { MfaEnableResponseSchema, TokenPairSchema } from "../schemas/auth";
import { ApiError } from "../schemas/common";
import { UserSchema } from "../schemas/user";
import { ChannelSchema } from "../schemas/channel";
import {
  CloudAttachmentCreateSchema,
  CloudAttachmentResponseSchema,
  MessageAttachmentUploadSchema,
  MessageSchema,
} from "../schemas/message";

const apiUrl = "http://localhost:8000";

export const refreshSession = async (): Promise<TokenPairSchema | null> => {
  try {
    const savedTokenPair = await api.auth.getCurrentSavedTokenPair();

    const expiresAt = new Date(savedTokenPair.issuedAt);
    expiresAt.setSeconds(expiresAt.getSeconds() + savedTokenPair.expiresIn);

    if (expiresAt < new Date()) {
      console.log("Session is expired and need to be refreshed");
      return await api.auth.refreshSession(savedTokenPair.refreshToken);
    }

    localStorage.setItem("accessToken", savedTokenPair.accessToken);

    return savedTokenPair;
  } catch (err) {
    if (err instanceof ApiError) {
      console.log("No session was found");
      return null;
    }
    throw err;
  }
};

const axiosWithCookies = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const axiosWithToken = axios.create({
  baseURL: apiUrl,
});

axiosWithToken.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function baseFetch<T>(
  requestFn: () => Promise<AxiosResponse<T, any>>
): Promise<T> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new ApiError(data.code, data.message, data.errors);
    }
    throw error;
  }
}

const api = {
  auth: {
    getCurrentSavedTokenPair: async (): Promise<TokenPairSchema> => {
      return baseFetch(() =>
        axiosWithCookies.get<TokenPairSchema>("/auth/token")
      );
    },
    refreshSession: async (refreshToken: string) => {
      return baseFetch(() =>
        axiosWithCookies.postForm<TokenPairSchema>("/auth/token", {
          refreshToken,
        })
      );
    },
    signIn: async (
      login: string,
      password: string,
      totp: string | null
    ): Promise<TokenPairSchema> => {
      return baseFetch(() =>
        axiosWithCookies.postForm<TokenPairSchema>("/auth/sign-in", {
          login,
          password,
          totp,
        })
      );
    },
    singUp: async (
      username: string,
      email: string,
      globalName: string,
      password: string
    ): Promise<UserSchema> => {
      return baseFetch(() =>
        axiosWithCookies.postForm<UserSchema>("/auth/sign-up", {
          username,
          email,
          globalName,
          password,
        })
      );
    },
  },
  users: {
    getMe: async (): Promise<UserSchema> => {
      return baseFetch(() => axiosWithToken.get<UserSchema>("/users/@me"));
    },
    getChannels: async (): Promise<ChannelSchema[]> => {
      return baseFetch(() =>
        axiosWithToken.get<ChannelSchema[]>("/users/@me/channels")
      );
    },
    removeAvatar: async (): Promise<void> => {
      return baseFetch(() => axiosWithToken.delete("/users/@me/avatar"));
    },
    updateAvatar: async (file: File): Promise<void> => {
      var formData = new FormData();
      formData.append("file", file);

      await axiosWithToken.put("/users/@me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    requestEmailVerificationCode: async (): Promise<void> => {
      return baseFetch(() =>
        axiosWithToken.post("/users/@me/email/request-verify-code")
      );
    },
    verifyEmail: async (code: string): Promise<void> => {
      return baseFetch(() =>
        axiosWithToken.post("/users/@me/email/verify", { code })
      );
    },
    enableMfa: async (
      password: string,
      emailCode: string | null
    ): Promise<MfaEnableResponseSchema> => {
      const body: Record<string, string> = { password: password };
      if (emailCode) {
        body.emailCode = emailCode;
      }
      return baseFetch(() =>
        axiosWithToken.post<MfaEnableResponseSchema>(
          "/users/@me/mfa/totp/enable",
          body
        )
      );
    },
  },
  channels: {
    getMessages: async (
      channelId: string,
      before: string | null,
      limit: string | null
    ): Promise<MessageSchema[]> => {
      return baseFetch(() =>
        axiosWithToken.get<MessageSchema[]>(`/channels/${channelId}/messages`, {
          params: { before, limit },
        })
      );
    },
    createAttachments: async (
      channelId: string,
      attachments: CloudAttachmentCreateSchema[]
    ): Promise<CloudAttachmentResponseSchema[]> => {
      return baseFetch(() =>
        axiosWithToken.post<CloudAttachmentResponseSchema[]>(
          `/channels/${channelId}/attachments`,
          { files: attachments }
        )
      );
    },
    createMessage: async (
      channelId: string,
      content: string,
      attachments: MessageAttachmentUploadSchema[]
    ): Promise<MessageSchema> => {
      return baseFetch(() =>
        axiosWithToken.post<MessageSchema>(`/channels/${channelId}/messages`, {
          content,
          attachments,
        })
      );
    },
  },
  common: {
    uploadFile: async (uploadUrl: string, file: File): Promise<void> => {
      return await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        transformRequest: [(data) => data],
      });
    },
  },
};

export default api;
