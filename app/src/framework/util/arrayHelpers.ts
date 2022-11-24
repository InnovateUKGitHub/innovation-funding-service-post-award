/**
 * returns array with null or undefined elements removed
 */
export function filterEmpty<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(x => x !== null && x !== undefined) as T[];
}

/**
 * Returns an array flattened one level
 */
export function flatten<T>(array: T[][]): T[] {
  return array.reduce<T[]>((a, b) => a.concat(b), []);
}

export const hasNoDuplicates = <T>(array: T[]) => array.every((e, i) => array.indexOf(e) === i);

export const groupBy = <T, K>(list: T[], getKey: (entry: T) => K) => {
  const map = new Map<K, T[]>();
  list.forEach(entry => {
    const key = getKey(entry);
    const values = map.get(key) || [];
    map.set(key, [...values, entry]);
  });
  return map;
};

export const getArrayFromPeriod = <T extends { periodId: number }>(
  originalArray: T[],
  currentPeriod: number,
  lastPeriodId?: number,
) => {
  if (!originalArray.length) return originalArray;

  return originalArray.filter(item => {
    const notPreviousPeriod = item.periodId >= currentPeriod;

    if (!lastPeriodId) return notPreviousPeriod;

    return notPreviousPeriod && item.periodId <= lastPeriodId;
  });
};

export const getArrayExcludingPeriods = <
  T extends {
    periodId: number;
  },
>(
  originalArray: T[],
  excludePeriods: Set<number>,
): T[] => {
  if (!originalArray.length) return originalArray;

  return originalArray.filter(item => !excludePeriods.has(item.periodId));
};
