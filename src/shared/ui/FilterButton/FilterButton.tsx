import styles from "./FilterButton.module.scss";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  count?: number;
  onClick: () => void;
}

export function FilterButton({ label, isActive, count, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-active={isActive}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {label}
      {typeof count === "number" ? <span className={styles.count}>{count}</span> : null}
    </button>
  );
}
