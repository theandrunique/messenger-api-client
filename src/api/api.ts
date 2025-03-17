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
import env from "../env";

let _tokens: TokenPairSchema | null = null;

export const setTokens = (tokens: TokenPairSchema) => {
  _tokens = tokens;
};

export const getTokens = (): TokenPairSchema | null => {
  return _tokens;
};

export const removeTokens = () => {
  _tokens = null;
};

export const refreshSessionIfNeed = async () => {
  try {
    let currentTokens = getTokens();

    if (!currentTokens) {
      try {
        currentTokens = await getCurrentSavedTokenPair();
      } catch (err) {
        if (
          err instanceof ApiError &&
          err.code === "AUTH_NO_SESSION_INFO_FOUND"
        ) {
          throw new Error("no-session");
        }
        throw err;
      }
    }

    const expiresAt = new Date(currentTokens.issuedAt);
    expiresAt.setSeconds(expiresAt.getSeconds() + currentTokens.expiresIn);

    if (expiresAt < new Date()) {
      console.log("Refreshing session...");
      const newTokens = await refreshToken(currentTokens.refreshToken);
      setTokens(newTokens);
      return newTokens;
    } else {
      setTokens(currentTokens);
      return currentTokens;
    }
  } catch (err) {
    if (axios.isAxiosError(err) && !err.response) {
      console.warn("Network error while refreshing session", err);
      throw new Error("network-error");
    }

    console.error("Error while refreshing session", err);
    removeTokens();
    throw err;
  }
};

const axiosWithToken = axios.create({
  baseURL: env.API_ENDPOINT,
});

const axiosWithCookie = axios.create({
  baseURL: env.API_ENDPOINT,
  withCredentials: true,
});

let isInterceptorSetup = false;

export const setupInterceptors = (onRefreshError: () => void) => {
  if (isInterceptorSetup) return;

  let isRefreshing = false;
  let refreshSubscribers: Array<() => void> = [];

  axiosWithToken.interceptors.request.use(
    async (config) => {
      const tokens = await getTokens();
      if (tokens) {
        config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosWithToken.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshSubscribers.push(() => {
              resolve(axiosWithToken(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await refreshSessionIfNeed();
          refreshSubscribers.forEach((callback) => callback());
          refreshSubscribers = [];
          return axiosWithToken(originalRequest);
        } catch (refreshError) {
          refreshSubscribers = [];
          onRefreshError();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );

  isInterceptorSetup = true;
};

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

export const getCurrentSavedTokenPair = (): Promise<TokenPairSchema> => {
  return baseFetch(() => axiosWithCookie.get<TokenPairSchema>("/auth/token"));
};

export const refreshToken = (refreshToken: string) => {
  return baseFetch(() =>
    axiosWithCookie.postForm<TokenPairSchema>("/auth/token", {
      refreshToken,
    })
  );
};

export const signIn = (
  login: string,
  password: string,
  totp: string | null
): Promise<TokenPairSchema> => {
  return baseFetch(() =>
    axiosWithCookie.postForm<TokenPairSchema>("/auth/sign-in", {
      login,
      password,
      totp,
    })
  );
};

export const singUp = (
  username: string,
  email: string,
  globalName: string,
  password: string
): Promise<UserSchema> => {
  return baseFetch(() =>
    axiosWithCookie.postForm<UserSchema>("/auth/sign-up", {
      username,
      email,
      globalName,
      password,
    })
  );
};

export const signOut = (): Promise<void> => {
  return baseFetch(() =>
    axiosWithToken.post("/auth/sign-out", {}, { withCredentials: true })
  );
};

export const getMe = (): Promise<UserSchema> => {
  return baseFetch(() => axiosWithToken.get<UserSchema>("/users/@me"));
};

export const getChannels = (): Promise<ChannelSchema[]> => {
  return baseFetch(() =>
    axiosWithToken.get<ChannelSchema[]>("/users/@me/channels")
  );
};

export const removeAvatar = (): Promise<void> => {
  return baseFetch(() => axiosWithToken.delete("/users/@me/avatar"));
};

export const updateAvatar = async (file: File): Promise<void> => {
  var formData = new FormData();
  formData.append("file", file);

  await axiosWithToken.put("/users/@me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const requestEmailVerificationCode = (): Promise<void> => {
  return baseFetch(() =>
    axiosWithToken.post("/users/@me/email/request-verify-code")
  );
};

export const verifyEmail = (code: string): Promise<void> => {
  return baseFetch(() =>
    axiosWithToken.post("/users/@me/email/verify", { code })
  );
};

export const enableMfa = (
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
};

export const getMessages = (
  channelId: string,
  before: string | null,
  limit: string | null
): Promise<MessageSchema[]> => {
  return baseFetch(() =>
    axiosWithToken.get<MessageSchema[]>(`/channels/${channelId}/messages`, {
      params: { before, limit },
    })
  );
};

export const createAttachments = (
  channelId: string,
  attachments: CloudAttachmentCreateSchema[]
): Promise<CloudAttachmentResponseSchema[]> => {
  return baseFetch(() =>
    axiosWithToken.post<CloudAttachmentResponseSchema[]>(
      `/channels/${channelId}/attachments`,
      { files: attachments }
    )
  );
};

export const deleteUnusedAttachment = (uploadedFilename: string) => {
  return baseFetch(() => axiosWithToken.delete(`/attachments/${encodeURIComponent(uploadedFilename)}`));
};

export const createMessage = (
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
};

export const uploadFile = async (
  uploadUrl: string,
  file: File
): Promise<void> => {
  return await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    transformRequest: [(data) => data],
  });
};
