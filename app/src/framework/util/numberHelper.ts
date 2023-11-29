export const isFiniteNumber = (value?: number | null): value is number => isNumber(value) && isFinite(value);

export const isNumber = (value?: number | null): value is number => {
  // Note: JS treats Zero as false 👀
  if (value !== 0 && !value) return false;

  const isValueNumber = typeof value === "number";
  const isNotNaN = !isNaN(value);

  return isValueNumber && isNotNaN;
};

/**
 * @description Added an Epsilon cover edge cases such as 1.005 to round correctly
 */
export function roundCurrency(value: number) {
  const valueToBeRounded = (value + Number.EPSILON) * 100;

  const roundedValue = Math.round(valueToBeRounded);
  /**
   * Occasionally a negative zero (-0) is being generated. JS float
   * spec allows for negative and positive zeros. Since -0 is strictly equal to 0(!)
   * we can use this check and return the positive 0 if truthy
   */
  if (roundedValue === 0) return 0;
  return roundedValue / 100;
}

export const validCurrencyRegex = /^-?£?(\d+|\.|\d+\.|\.\d{1,2}|\d+\.\d{1,2})?$/;

/**
 * returns difference between two numbers as a percentage to two decimal points
 */
export function diffAsPercentage(startingValue: number, secondValue: number) {
  if (startingValue === 0) return 0;

  const roundedStarting = roundCurrency(startingValue);
  const roundedSecond = roundCurrency(secondValue);

  const roundedDiff = roundedSecond - roundedStarting;
  const unRoundedPercentage = (roundedDiff * 100) / roundedStarting;

  return roundCurrency(unRoundedPercentage);
}

/**
 * @description Converts a string to a number where possible.
 * - If the object passed in is empty, will return null.
 * - If the object passed in cannot be parsed as a number, returns NaN
 */
export function parseNumber(x?: string | number | null) {
  // Note: explicit check since !x captures zero
  if (x === null || x === undefined) return null;

  const emptyString = typeof x === "string" && !x.trim().length;

  if (emptyString) return null;

  const value = Number(x);

  return isNumber(value) ? value : null;
}

/**
 * Parse a string to a number. Strips out any mis-laid pound symbols.
 * @param x Number to parse
 * @returns Parsed number
 */
export function parseCurrency(x?: string | number | null) {
  if (typeof x === "string") return parseFloat(x.replaceAll("£", ""));
  if (typeof x === "number") return x;
  return NaN;
}

/**
 * _sumBy_
 *
 * Takes an array of values as first argument, and a reducer function for second.
 * Returns the sum of values extracted with the reducer function.
 */
export function sumBy<T>(items: T[], reducer: (item: T) => number): number {
  if (!items.length) return 0;

  return items.reduce((total, item) => total + reducer(item), 0);
}

export const withinRange = <T = number>(numberToCheck: T, startRange: T, endRange: T): boolean => {
  const withinBottomRange: boolean = numberToCheck >= startRange;
  const withinTopRange: boolean = numberToCheck <= endRange;

  return withinBottomRange && withinTopRange;
};

/**
 * returns the percentage value of passed in numbers.
 * Pass in the 100% value first as total and the divisor second
 */
export function calcPercentage(total: Nullable<number>, amount: number) {
  if (!total) return null;
  return (100 * (amount || 0)) / total;
}

/**
 * Calculate a percentage of a currency value.
 *
 * @param amount The amount of money to get the percentage of
 * @param percentage The percentage
 * @param extraDigits The number of additional digits to include in the total
 * @returns A proportion of the total amount
 */
export function multiplyCurrency(amount: number, percentage: number, extraDigits = 0) {
  const multiplier = Math.pow(10, extraDigits);
  return Math.floor(multiplier * roundCurrency(amount) * percentage) / (100 * multiplier);
}
