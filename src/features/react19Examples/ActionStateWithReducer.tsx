import { startTransition, useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { Button, FormField } from "shared/ui";
import { simulateSave } from "./model/simulateSave";
import styles from "./React19Examples.module.scss";

interface ProfileValues {
  name: string;
  email: string;
}

interface ProfileState {
  status: "idle" | "dirty" | "success" | "error";
  saved: ProfileValues | null;
  saveCount: number;
}

type ProfileAction = { type: "edit" } | { type: "save"; formData: FormData };
const initialState: ProfileState = { status: "idle", saved: null, saveCount: 0 };

// кастомный редюсер для useActionState
function profileReducer(
  previous: ProfileState,
  action: ProfileAction,
): ProfileState | Promise<ProfileState> {
  if (action.type === "edit") {
    return previous.status === "dirty" ? previous : { ...previous, status: "dirty" };
  }
  const values: ProfileValues = {
    name: String(action.formData.get("name") ?? "").trim(),
    email: String(action.formData.get("email") ?? "").trim(),
  };
  if (!values.name || !values.email) return { ...previous, status: "error" };

  return simulateSave(values).then((saved) => ({
    status: "success",
    saved,
    saveCount: previous.saveCount + 1,
  }));
}

function ProfileFields({ state }: { state: ProfileState }) {
  const id = useId();
  const { pending } = useFormStatus();

  return (
    <>
      <fieldset className={styles.fields} disabled={pending}>
        <FormField id={`${id}-name`} name="name" label="Имя" autoComplete="name" required />
        <FormField
          id={`${id}-email`}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <Button type="submit">{pending ? "Сохраняем профиль…" : "Сохранить профиль"}</Button>
      </fieldset>
      <p className={styles.status} role="status">
        {pending
          ? "submitting — отправляем все поля…"
          : state.status === "dirty"
            ? "dirty — есть несохранённые изменения."
            : state.status === "success"
              ? "success — профиль сохранён, поля очищены."
              : state.status === "error"
                ? "Заполните оба поля, используя не только пробелы."
                : "idle — заполните профиль."}
      </p>
    </>
  );
}

export function ActionStateWithReducer() {
  const [state, dispatch] = useActionState(profileReducer, initialState);

  return (
    <div className={styles.form}>
      <form
        className={styles.form}
        action={(formData) => dispatch({ type: "save", formData })}
        onChange={() => startTransition(() => dispatch({ type: "edit" }))}
      >
        <ProfileFields state={state} />
      </form>
      {state.saved && (
        <p className={styles.saved}>
          Последнее сохранение №{state.saveCount}: {state.saved.name} · {state.saved.email}
        </p>
      )}
    </div>
  );
}
