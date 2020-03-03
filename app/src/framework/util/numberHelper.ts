const EPISILON = Math.pow(2, -52);
export const isNumber = (value: number | null): value is number => typeof value === "number" && !isNaN(value);
// Adding epsilon to ensure things like 1.005 round correctly
export const roundCurrency = (value: number) => Math.round((value + EPISILON) * 100) / 100;
