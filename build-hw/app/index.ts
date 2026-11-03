import { getRouteName, routes } from "./routes.js";
import { formatCount } from "./utils.js";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Не найден элемент #app");
const app = root;
let navigationId = 0;

async function renderRoute(): Promise<void> {
  const currentNavigation = ++navigationId;
  const route = getRouteName(location.hash);
  app.setAttribute("aria-busy", "true");
  app.textContent = "Загрузка страницы…";

  document.querySelectorAll<HTMLAnchorElement>("nav a").forEach((link) => {
    if (getRouteName(link.hash) === route) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  try {
    if (!route) {
      app.textContent = "Страница не найдена. Выберите другой раздел в навигации.";
      return;
    }

    const page = await routes[route]();
    if (currentNavigation === navigationId) app.replaceChildren(page.render());
  } catch {
    if (currentNavigation === navigationId) {
      app.textContent = "Не удалось загрузить страницу. Обновите её, чтобы повторить попытку.";
    }
  } finally {
    if (currentNavigation === navigationId) app.setAttribute("aria-busy", "false");
  }
}

document.querySelector("#route-count")!.textContent = formatCount(Object.keys(routes).length);
window.addEventListener("hashchange", () => void renderRoute());
void renderRoute();
