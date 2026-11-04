import { useState } from "react";
import { Layers, RotateCcw, Trash2 } from "lucide-react";
import {
  Button,
  ConfirmDialog,
  Tooltip,
  TooltipPosition,
  useConfirmDialog,
  useTheme,
  useToast,
} from "shared/ui";
import styles from "./PortalShowcase.module.scss";

const positions: Record<TooltipPosition, string> = {
  [TooltipPosition.Top]: "Сверху",
  [TooltipPosition.Bottom]: "Снизу",
  [TooltipPosition.Left]: "Слева",
  [TooltipPosition.Right]: "Справа",
};

export function PortalShowcase() {
  const theme = useTheme();
  const [position, setPosition] = useState(TooltipPosition.Top);
  const [parentClicks, setParentClicks] = useState(0);
  const [itemExists, setItemExists] = useState(true);
  const [result, setResult] = useState("Элемент пока не удалён.");
  const { dialog, showConfirmDialog, resolveConfirmDialog } = useConfirmDialog();
  const notify = useToast();

  async function handleDelete() {
    const confirmed = await showConfirmDialog({
      title: "Удалить тестовый элемент?",
      description: "Подтвердите удаление. Для повторной проверки элемент можно будет восстановить.",
    });

    if (confirmed) {
      setItemExists(false);
      setResult("Удаление подтверждено. Элемент удалён.");
      notify("Тестовый элемент удалён.");
    } else {
      setResult("Удаление отменено. Элемент сохранён.");
    }
  }

  function restoreItem() {
    setItemExists(true);
    setResult("Элемент восстановлен. Можно повторить проверку.");
    notify("Тестовый элемент восстановлен.");
  }

  return (
    <section className={styles.page} data-theme={theme}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h1>Практика React Portal</h1>
            <p>Подсказки, подтверждение действий и тема.</p>
          </div>
        </header>

        <div className={styles.examples}>
          <section className={styles.card} aria-labelledby="tooltip-title">
            <h2 id="tooltip-title">1. Подсказка и события</h2>
            <p>Выберите положение, затем наведите курсор на кнопку.</p>
            <label className={styles.position}>
              Положение подсказки
              <select
                value={position}
                onChange={(event) => setPosition(event.target.value as TooltipPosition)}
              >
                {Object.values(TooltipPosition).map((value) => (
                  <option key={value} value={value}>
                    {positions[value]}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.eventArea} onClick={() => setParentClicks((count) => count + 1)}>
              <p className={styles.parentLabel}>Блок для проверки кликов</p>
              <Tooltip
                position={position}
                content={`Подсказка поверх границ родителя. Тема: ${theme === "light" ? "светлая" : "тёмная"}.`}
              >
                <Button variant="secondary">Наведите на меня</Button>
              </Tooltip>
              <p className={styles.clicks}>
                Кликов у родителя: <output aria-label="Кликов у родителя">{parentClicks}</output>
              </p>
            </div>
          </section>

          <section className={styles.card} aria-labelledby="confirm-title">
            <h2 id="confirm-title">2. Подтверждение удаления</h2>
            <p>Сначала подтвердите действие в диалоге. При отмене элемент останется на месте.</p>

            <div className={styles.item}>
              <span className={styles.itemIcon} aria-hidden="true">
                <Layers size={24} />
              </span>
              <div>
                <h3>{itemExists ? "Тестовый элемент" : "Элемент удалён"}</h3>
                <p>
                  {itemExists
                    ? "Готов к проверке подтверждения"
                    : "Восстановите его, чтобы повторить пример"}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              className={itemExists ? styles.delete : undefined}
              onClick={itemExists ? handleDelete : restoreItem}
            >
              {itemExists ? <Trash2 aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
              {itemExists ? "Удалить" : "Восстановить элемент"}
            </Button>
            <p className={styles.result} role="status">
              {result}
            </p>
          </section>
        </div>

        <p className={styles.contextHint}>
          Текущая тема: <strong>{theme === "light" ? "светлая" : "тёмная"}</strong>. 
          Переключатель в правом верхнем углу.
        </p>
      </div>
      {dialog && <ConfirmDialog {...dialog} onResolve={resolveConfirmDialog} />}
    </section>
  );
}
