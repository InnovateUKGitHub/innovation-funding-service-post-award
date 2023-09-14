/**
 * Always returns a non-null array, coercing null/undefined to an empty array.
 *
 * @param input An array to filter null/undefined results out of.
 * @returns An array with only defined results. If all inputs are null/undefined, returns an empty array.
 */
const toArray = <T>(input: T | T[] | null): T[] => {
  if (Array.isArray(input)) return input;
  if (isNaN(input as number) || input === null) return [];
  return [input];
};

export { toArray };
