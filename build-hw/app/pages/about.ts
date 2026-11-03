import { createHeading } from "../utils.js";

export function render(): HTMLElement {
  const section = document.createElement("section");
  const description = document.createElement("p");
  description.textContent =
    "esbuild собирает приложение и библиотеку, а SWC преобразует TypeScript библиотеки в ESM и CommonJS.";
  const list = document.createElement("ul");
  for (const text of [
    "Tree shaking удаляет неиспользуемые экспорты utils.ts.",
    "Динамические import() разделяют страницы на чанки.",
    "React и lodash остаются внешними зависимостями библиотеки.",
    "Dev: watch без минификации. Prod: минификация и source maps.",
  ]) {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  }
  section.append(createHeading("О сборке"), description, list);
  return section;
}
