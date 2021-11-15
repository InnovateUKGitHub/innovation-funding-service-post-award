const epsilon = Math.pow(2, -52);

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
  if (value === 0) return value;

  const valueToBeRounded = (value + epsilon) * 100;
  const roundedValue = Math.round(valueToBeRounded);

  return roundedValue / 100;
}

export function diffAsPercentage<T extends number>(startingValue: T, secondValue: T) {
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

export function sum<T>(items: T[], value: (item: T) => number): number {
  if (!items.length) return 0;

  return items.reduce((total, item) => total + value(item), 0);
}

export const withinRange = <T = number>(numberToCheck: T, startRange: T, endRange: T): boolean => {
  const withinBottomRange: boolean = numberToCheck >= startRange;
  const withinTopRange: boolean = numberToCheck <= endRange;

  return withinBottomRange && withinTopRange;
};
