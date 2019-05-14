export const isNumber = (value: number | null): value is number => typeof value === "number" && !isNaN(value);
