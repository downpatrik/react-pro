import { useCallback, useEffect, useRef, useState } from "react";

export interface ConfirmDialogOptions {
  title: string;
  description: string;
}

interface PendingConfirmation {
  promise: Promise<boolean>;
  resolve: (confirmed: boolean) => void;
}

export function useConfirmDialog() {
  const [dialog, setDialog] = useState<ConfirmDialogOptions | null>(null);
  const pendingRef = useRef<PendingConfirmation | null>(null);

  const showConfirmDialog = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    if (pendingRef.current) return pendingRef.current.promise;

    let resolve!: PendingConfirmation["resolve"];
    const promise = new Promise<boolean>((complete) => {
      resolve = complete;
    });
    pendingRef.current = { promise, resolve };
    setDialog(options);
    return promise;
  }, []);

  const resolveConfirmDialog = useCallback((confirmed: boolean) => {
    const pending = pendingRef.current;
    pendingRef.current = null;
    setDialog(null);
    pending?.resolve(confirmed);
  }, []);

  useEffect(
    () => () => {
      pendingRef.current?.resolve(false);
      pendingRef.current = null;
    },
    [],
  );

  return { dialog, showConfirmDialog, resolveConfirmDialog };
}
