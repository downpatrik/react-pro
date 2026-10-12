import { createContext, useContext } from "react";

export type ToastVariant = "info" | "error";
export type Notify = (message: string, variant?: ToastVariant) => void;

export const ToastContext = createContext<Notify | null>(null);

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return notify;
}
