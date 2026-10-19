import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

const API_URL = "https://api.v2.react-learning.ru";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  roles: ("USER" | "ADMIN")[];
}

const registeredUserSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
});

const tokenSchema = z
  .string()
  .trim()
  .transform((token) => token.replace(/^Bearer(?:\s+|$)/i, "").trim())
  .pipe(z.string().min(1));
const loginResponseSchema = z.union([
  z.object({ token: tokenSchema }).transform(({ token }) => token),
  z.object({ access_token: tokenSchema }).transform(({ access_token }) => access_token),
  z.object({ accessToken: tokenSchema }).transform(({ accessToken }) => accessToken),
]);
const userSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().optional(),
});

export type AuthUser = z.infer<typeof userSchema>;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, timeout: 15_000 }),
  endpoints: (build) => ({
    register: build.mutation<z.infer<typeof registeredUserSchema>, RegisterCredentials>({
      async queryFn(credentials, _api, _extraOptions, fetchWithBaseQuery) {
        const response = await fetchWithBaseQuery({
          url: "/auth/register",
          method: "POST",
          body: credentials,
        });
        if (response.error) return { error: response.error };

        const result = z.object({ user: registeredUserSchema }).safeParse(response.data);
        return result.success
          ? { data: result.data.user }
          : {
              error: {
                status: "CUSTOM_ERROR",
                error: "Не удалось прочитать ответ сервера. Попробуйте войти в аккаунт.",
              },
            };
      },
    }),
    login: build.mutation<string, LoginCredentials>({
      async queryFn(credentials, _api, _extraOptions, fetchWithBaseQuery) {
        const response = await fetchWithBaseQuery({
          url: "/auth/login",
          method: "POST",
          body: credentials,
        });
        if (response.error) return { error: response.error };

        const result = loginResponseSchema.safeParse(response.data);
        return result.success
          ? { data: result.data }
          : {
              error: {
                status: "CUSTOM_ERROR",
                error: "Сервер не вернул токен авторизации. Попробуйте ещё раз.",
              },
            };
      },
    }),
    getMe: build.query<AuthUser, string>({
      keepUnusedDataFor: 0,
      async queryFn(token, _api, _extraOptions, fetchWithBaseQuery) {
        const response = await fetchWithBaseQuery({
          url: "/users/me",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.error) return { error: response.error };

        const result = userSchema.safeParse(response.data);
        return result.success
          ? { data: result.data }
          : {
              error: {
                status: "CUSTOM_ERROR",
                error: "Сервер вернул некорректные данные профиля.",
              },
            };
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;

export function getRegisterErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "status" in error) {
    if (error.status === 409) return "Этот email уже зарегистрирован. Войдите в аккаунт.";
    if (error.status === 400 || error.status === 422) {
      return "Проверьте имя, email, пароль и выбранные роли.";
    }
    if (error.status === "CUSTOM_ERROR" && "error" in error && typeof error.error === "string") {
      return error.error;
    }
    if (typeof error.status === "number") {
      return "Сервис временно недоступен. Попробуйте ещё раз.";
    }
  }
  return "Не удалось зарегистрироваться. Проверьте подключение и попробуйте ещё раз.";
}

export function getLoginErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "status" in error) {
    if (error.status === 401 || error.status === 403) return "Неверный email или пароль.";
    if (error.status === 400 || error.status === 422) return "Проверьте email и пароль.";
    if (error.status === "CUSTOM_ERROR" && "error" in error && typeof error.error === "string") {
      return error.error;
    }
    if (typeof error.status === "number") {
      return "Сервис временно недоступен. Попробуйте ещё раз.";
    }
  }
  return "Не удалось войти. Проверьте подключение и попробуйте ещё раз.";
}
