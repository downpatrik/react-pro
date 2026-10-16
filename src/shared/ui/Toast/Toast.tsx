import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Info, TriangleAlert, X } from "lucide-react";
import { ToastContext, type Notify, type ToastVariant } from "./toastContext";
import styles from "./Toast.module.scss";

interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timeoutsRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const nextIdRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback((id: number) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback<Notify>(
    (message, variant = "info") => {
      const id = ++nextIdRef.current;
      setToasts((current) => [...current, { id, message, variant }]);
      timeoutsRef.current.set(
        id,
        setTimeout(() => dismiss(id), 4000),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const timeout of timeouts.values()) {
        clearTimeout(timeout);
      }
      timeouts.clear();
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        className={styles.viewport}
        ref={viewportRef}
        data-active={toasts.length > 0}
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className={styles.stack}>
          {toasts.map((toast) => (
            <button
              className={[styles.toast, toast.variant === "error" ? styles.error : ""].join(" ")}
              key={toast.id}
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label={`Закрыть уведомление: ${toast.message}`}
              title="Нажмите, чтобы закрыть"
            >
              {toast.variant === "error" ? (
                <TriangleAlert className={styles.icon} aria-hidden="true" />
              ) : (
                <Info className={styles.icon} aria-hidden="true" />
              )}
              <span className={styles.message}>{toast.message}</span>
              <X className={styles.close} size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
