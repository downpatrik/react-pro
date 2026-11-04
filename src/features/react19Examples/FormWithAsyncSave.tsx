import { startTransition, useActionState, useEffect, useId } from "react";
import { Button, FormField, useToast } from "shared/ui";
import { simulateSave } from "./model/simulateSave";
import styles from "./React19Examples.module.scss";

type SaveState = { status: "idle" | "success" | "error"; error?: string };
const initialState: SaveState = { status: "idle" };

export function FormWithAsyncSave() {
  const id = useId();
  const notify = useToast();
  const [state, submit, isPending] = useActionState(
    async (_previous: SaveState, payload: FormData | "reset"): Promise<SaveState> => {
      if (payload === "reset") return initialState;
      const text = String(payload.get("text") ?? "").trim();
      if (!text) return { status: "error", error: "Введите текст." };

      await simulateSave(text);
      notify(`Saved! Сохранено: ${text}`);
      return { status: "success" };
    },
    initialState,
  );

  useEffect(() => {
    if (state.status !== "success") return;
    const timeout = setTimeout(() => startTransition(() => submit("reset")), 1500);
    return () => clearTimeout(timeout);
  }, [state.status, submit]);

  return (
    <form action={submit} className={styles.form} aria-busy={isPending}>
      <fieldset className={styles.fields} disabled={isPending || state.status === "success"}>
        <FormField
          id={`${id}-text`}
          name="text"
          label="Текст для сохранения"
          placeholder="Например, заметка о React 19"
          required
          maxLength={200}
          error={state.error}
        />
        <Button type="submit">
          {isPending ? "Saving…" : state.status === "success" ? "Saved!" : "Сохранить"}
        </Button>
      </fieldset>
      <p className={styles.status} role="status">
        {isPending
          ? "Сохраняем текст…"
          : state.status === "success"
            ? "Сохранено. Поле очищено."
            : "Готово к сохранению."}
      </p>
    </form>
  );
}
