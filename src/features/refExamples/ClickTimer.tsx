import { useRef } from "react";
import { Button, useToast } from "shared/ui";

interface ClickData {
  startTime: number | null;
  clickCount: number;
}

export function ClickTimer() {
  const notify = useToast();
  const clickDataRef = useRef<ClickData>({ startTime: null, clickCount: 0 });

  function handleClick() {
    const now = Date.now();
    const data = clickDataRef.current;
    data.clickCount += 1;

    if (data.startTime === null) {
      data.startTime = now;
      const message = "[ClickTimer] Первый клик. Всего кликов: 1";
      console.log(message);
      notify(message);
      return;
    }

    const message = `[ClickTimer] С первого клика: ${now - data.startTime} мс. Всего кликов: ${data.clickCount}`;
    console.log(message);
    notify(message);
  }

  return <Button onClick={handleClick}>Зафиксировать клик</Button>;
}
