export const routes = {
  home: () => import("./pages/home.js"),
  about: () => import("./pages/about.js"),
};

export type RouteName = keyof typeof routes;

export function getRouteName(hash: string): RouteName | null {
  const name = hash.replace(/^#\/?/, "") || "home";
  return name === "home" || name === "about" ? name : null;
}
