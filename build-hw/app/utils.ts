export function formatCount(count: number): string {
  return new Intl.NumberFormat("ru-RU").format(count);
}

export function createHeading(title: string): HTMLHeadingElement {
  const heading = document.createElement("h1");
  heading.textContent = title;
  return heading;
}

// unused
export function debugMessage(): string {
  return "TREE_SHAKING_UNUSED_UTIL";
}

// unused
export function square(value: number): number {
  return value * value;
}
