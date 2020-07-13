export function filterEmpty<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(x => x !== null && x !== undefined) as T[];
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce<T[]>((a, b) => a.concat(b), []);
}

export const hasNoDuplicates = <T>(array: T[]) => array.every((e, i) => array.indexOf(e) === i);

export const groupBy = <T, K>(list: T[], getKey: (entry: T) => K) => {
  const map = new Map<K, T[]>();
  list.forEach(entry => {
    const key = getKey(entry);
    const values = map.get(key) || [];
    map.set(key, [...values , entry]);
  });
  return map;
};
