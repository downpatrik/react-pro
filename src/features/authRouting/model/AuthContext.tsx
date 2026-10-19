import { createContext } from "react";
import type { AuthUser } from "../api/authApi";

export interface AuthSession {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  profileError: string | null;
}

export interface AuthContextValue extends AuthSession {
  login: (token: string) => void;
  logout: () => void;
  retryProfile: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
