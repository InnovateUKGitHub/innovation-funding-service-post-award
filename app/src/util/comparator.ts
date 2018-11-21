export type IComparer<T> = (x: T, y: T) => number;

export const numberComparator: IComparer<number> = (a, b) => a - b;

export const dateComparator: IComparer<Date> = (a, b) => numberComparator(a.getTime(), b.getTime());
