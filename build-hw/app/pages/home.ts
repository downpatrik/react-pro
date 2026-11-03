import { createHeading } from "../utils.js";

export function render(): HTMLElement {
  const section = document.createElement("section");
  const description = document.createElement("p");
  description.textContent =
    "Главная страница загружена отдельным чанком. Перейдите в «О сборке», чтобы загрузить второй.";
  section.append(createHeading("Современная сборка фронтенда"), description);
  return section;
}
