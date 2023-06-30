/**
 * Always returns a non-null array, coercing null/undefined to an empty array.
 *
 * @param input An array to filter null/undefined results out of.
 * @returns An array with only defined results. If all inputs are null/undefined, returns an empty array.
 */
const toArray = (input: any): any[] => {
  if (Array.isArray(input)) return input;
  if (isNaN(input) || input === null) return [];
  return [input];
};

export { toArray };
