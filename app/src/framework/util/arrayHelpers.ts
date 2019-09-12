export function filterEmpty<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(x => x !== null && x !== undefined) as T[];
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce<T[]>((a, b) => a.concat(b), []);
}
