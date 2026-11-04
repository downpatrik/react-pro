import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";
import { themeStyles, useTheme } from "../Theme";
import type { ConfirmDialogOptions } from "./useConfirmDialog";
import styles from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps extends ConfirmDialogOptions {
  onResolve: (confirmed: boolean) => void;
}

export function ConfirmDialog({ title, description, onResolve }: ConfirmDialogProps) {
  const id = useId();
  const theme = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalRoot = document.getElementById("confirm-dialog-root");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !portalRoot) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const background = Array.from(document.body.children)
      .filter(
        (node): node is HTMLElement => node instanceof HTMLElement && !node.contains(portalRoot),
      )
      .map((node) => ({ node, inert: node.inert }));

    background.forEach(({ node }) => {
      node.inert = true;
    });
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLButtonElement>("button")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onResolve(false);
      }

      if (event.key === "Tab") {
        const buttons = dialog?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      background.forEach(({ node, inert }) => {
        node.inert = inert;
      });
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [onResolve, portalRoot]);

  if (!portalRoot) throw new Error("ConfirmDialog requires #confirm-dialog-root in index.html");

  return createPortal(
    <div
      className={`${styles.backdrop} ${themeStyles[theme]}`}
      data-theme={theme}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onResolve(false);
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
      >
        <h2 id={`${id}-title`}>{title}</h2>
        <p id={`${id}-description`}>{description}</p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onResolve(false)}>
            Отмена
          </Button>
          <Button className={styles.confirm} onClick={() => onResolve(true)}>
            Подтвердить
          </Button>
        </div>
      </div>
    </div>,
    portalRoot,
  );
}
