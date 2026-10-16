import { useEffect, useRef } from "react";
import { useToast } from "shared/ui";
import styles from "./RefExamples.module.scss";

const SOCKET_URL = "wss://echo.websocket.org";

export function WebSocketLogger() {
  const notify = useToast();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);
    socketRef.current = socket;

    function handleOpen() {
      console.log("[WebSocketLogger] Соединение открыто");
      notify("[WebSocketLogger] Соединение открыто");
      socketRef.current?.send("Тестовое сообщение из WebSocketLogger");
    }

    function handleMessage(event: MessageEvent) {
      console.log("[WebSocketLogger] Входящее сообщение:", event.data);
      notify(`[WebSocketLogger] Входящее сообщение: ${String(event.data)}`);
    }

    function handleError() {
      console.error("[WebSocketLogger] Не удалось установить или сохранить соединение");
      notify("[WebSocketLogger] Не удалось установить или сохранить соединение", "error");
    }

    function handleClose() {
      console.log("[WebSocketLogger] Соединение закрыто");
      notify("[WebSocketLogger] Соединение закрыто");
    }

    socketRef.current?.addEventListener("open", handleOpen);
    socketRef.current?.addEventListener("message", handleMessage);
    socketRef.current?.addEventListener("error", handleError);
    socketRef.current?.addEventListener("close", handleClose);

    return () => {
      socketRef.current?.removeEventListener("open", handleOpen);
      socketRef.current?.removeEventListener("message", handleMessage);
      socketRef.current?.removeEventListener("error", handleError);
      socketRef.current?.removeEventListener("close", handleClose);

      socketRef.current?.close();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [notify]);

  return (
    <p className={styles.note}>
      При открытии страницы подключаемся к echo-серверу "wss://echo.websocket.org" и отправляем тестовое сообщение. Ответ,
      состояние соединения и возможные ошибки отображаются в консоли и всплывающих уведомлениях.
      Соединение закрывается при уходе со страницы.
    </p>
  );
}
