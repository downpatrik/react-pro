import { createElement, type ReactElement } from "react";
import { greet } from "./string.js";

export { sum, average } from "./math.js";
export { greet } from "./string.js";

export interface GreetingProps {
  name: string;
}

export function Greeting({ name }: GreetingProps): ReactElement {
  return createElement("span", null, greet(name));
}
