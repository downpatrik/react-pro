import lodash from "lodash";

export function greet(name: string): string {
  return `Привет, ${lodash.upperFirst(name.trim()) || "гость"}!`;
}
