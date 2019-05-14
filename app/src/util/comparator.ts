export type IComparer<T> = (x: T, y: T) => number;

export const numberComparator: IComparer<number> = (a, b) => a - b;

export const dateComparator: IComparer<Date> = (a, b) => numberComparator(a.getTime(), b.getTime());

export const stringComparator: IComparer<string> = (a, b) => {
  if(a && b) return a.localeCompare(b);
  if(a) return -1;
  if(b) return 1;
  return 0;
};
