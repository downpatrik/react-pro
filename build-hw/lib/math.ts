import lodash from "lodash";

export function sum(values: readonly number[]): number {
  return lodash.sum(values);
}

export function average(values: readonly number[]): number {
  return values.length === 0 ? 0 : sum(values) / values.length;
}
