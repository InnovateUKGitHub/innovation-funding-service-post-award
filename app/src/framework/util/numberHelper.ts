const EPISILON = Math.pow(2, -52);
export const isNumber = (value: number | null | undefined): value is number => typeof value === "number" && !isNaN(value);
// Adding epsilon to ensure things like 1.005 round correctly
export const roundCurrency = (value: number) => Math.round((value + EPISILON) * 100) / 100;

/*
* Converts a string to a number where possible.
* If the object passed in is empty, will return null.
* If the object passed in cannot be parsed as a number, returns NaN
* */
export const parseNumber = (x: string | null | undefined) => {
  if (x === null || x === undefined || x === "") return null;
  return Number(x);
};
