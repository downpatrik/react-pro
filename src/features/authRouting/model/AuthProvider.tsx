import { useCallback, useEffect, useState, type ReactNode } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import { authApi, useGetMeQuery } from "../api/authApi";
import { AuthContext } from "./AuthContext";

const AUTH_TOKEN_KEY = "authToken";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY)?.trim() || null);
  const dispatch = useDispatch();
  const { currentData, error, isFetching, isUninitialized, refetch } = useGetMeQuery(
    token ?? skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    dispatch(authApi.util.resetApiState());
  }, [dispatch]);

  function login(nextToken: string) {
    dispatch(authApi.util.resetApiState());
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    setToken(nextToken);
  }

  useEffect(() => {
    if (error && "status" in error && (error.status === 401 || error.status === 403)) {
      // oxlint-disable-next-line react/set-state-in-effect
      logout();
    }
  }, [error, logout]);

  const value = {
    token,
    user: token ? (currentData ?? null) : null,
    isLoading: Boolean(token) && (isFetching || isUninitialized),
    profileError:
      token && error && !isFetching ? "Не удалось загрузить профиль. Попробуйте ещё раз." : null,
    login,
    logout,
    retryProfile: () => {
      if (token) void refetch();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
