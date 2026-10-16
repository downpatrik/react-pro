import type { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "icon";
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={[styles.button, styles[variant], className].filter(Boolean).join(" ")}
    />
  );
}
