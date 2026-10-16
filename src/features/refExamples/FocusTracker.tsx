import { useId, useRef, type FocusEvent } from "react";
import { Button, FormField, useToast } from "shared/ui";
import styles from "./RefExamples.module.scss";

export function FocusTracker() {
  const notify = useToast();
  const id = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const transitionCountRef = useRef(0);

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    const otherInput =
      event.currentTarget === firstInputRef.current
        ? secondInputRef.current
        : firstInputRef.current;

    if (otherInput && event.relatedTarget === otherInput) {
      transitionCountRef.current += 1;
      const message = `[FocusTracker] Переходов между полями: ${transitionCountRef.current}`;
      console.log(message);
      notify(message);
    }
  }

  return (
    <div className={styles.fields}>
      <FormField id={`${id}-first`} label="Первое поле" ref={firstInputRef} onFocus={handleFocus} />
      <FormField
        id={`${id}-second`}
        label="Второе поле"
        ref={secondInputRef}
        onFocus={handleFocus}
      />
      <Button onClick={() => firstInputRef.current?.focus()}>Сфокусировать на первом</Button>
    </div>
  );
}
