import type { ComponentPropsWithRef } from "react";
import styles from "./FormField.module.scss";

interface FormFieldProps extends ComponentPropsWithRef<"input"> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export function FormField({ id, label, error, hint, ...inputProps }: FormFieldProps) {
  const descriptionIds = [
    inputProps["aria-describedby"],
    hint ? `${id}-hint` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionIds || undefined}
      />
      {hint ? (
        <p className={styles.hint} id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
