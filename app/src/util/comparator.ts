export const numberComparator = (a: number, b: number) => a - b;

export const dateComparator = (a: Date, b: Date) => numberComparator(a.getTime(), b.getTime());
