import { useEffect, useId, useRef, useState } from "react";
import { FormField } from "shared/ui";
import styles from "./RefExamples.module.scss";

const INPUT_DEBOUNCE_MS = 400;

export function PreviousInput() {
  const id = useId();
  const [value, setValue] = useState("");
  const previousValueRef = useRef("");
  const outputRef = useRef<HTMLOutputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const output = outputRef.current;
    if (output && !output.textContent) {
      output.textContent = "-пусто-";
    }

    const timeout = setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.textContent = previousValueRef.current || "-пусто-";
      }
      previousValueRef.current = value;
      timeoutRef.current = null;
    }, INPUT_DEBOUNCE_MS);
    timeoutRef.current = timeout;

    return () => {
      clearTimeout(timeout);
      if (timeoutRef.current === timeout) {
        timeoutRef.current = null;
      }
    };
  }, [value]);

  return (
    <div className={styles.fields}>
      <FormField
        id={id}
        label="Текущее значение"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
        placeholder="Введите текст"
        hint={`История обновляется после паузы во вводе ${INPUT_DEBOUNCE_MS} мс.`}
      />
      <p className={styles.previous}>
        Предыдущее значение: <output ref={outputRef} htmlFor={id} aria-live="polite" />
      </p>
    </div>
  );
}
