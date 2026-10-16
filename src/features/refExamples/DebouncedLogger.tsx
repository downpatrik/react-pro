import { useEffect, useId, useRef, type ChangeEvent } from "react";
import { FormField, useToast } from "shared/ui";

export function DebouncedLogger() {
  const notify = useToast();
  const id = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    const value = event.target.value;
    timeoutRef.current = setTimeout(() => {
      console.log("[DebouncedLogger]", value);
      notify(`[DebouncedLogger] ${value || "-пусто-"}`);
      timeoutRef.current = null;
    }, 1000);
  }

  return (
    <FormField
      id={id}
      label="Текст с задержкой"
      onChange={handleChange}
      autoComplete="off"
      placeholder="Введите текст и подождите секунду"
    />
  );
}
