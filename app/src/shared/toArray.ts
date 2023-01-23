import isNull from "@ui/helpers/is-null";

/**
 * Always returns a non-null array, coercing null/undefined to an empty array.
 *
 * @param input An array to filter null/undefined results out of.
 * @returns An array with only defined results. If all inputs are null/undefined, returns an empty array.
 */
const toDefinedArray = <T>(
  input: (T | undefined | null)[] | ReadonlyArray<T | undefined | null> | undefined | null,
): T[] => {
  if (Array.isArray(input)) return input.filter(x => typeof x !== "undefined" && !isNull(x)) as T[];
  return [];
};

/**
 * Discard all null/undefined nodes within a GraphQL edge
 *
 * @param input An array of edges to filter null/undefined results out of.
 * @returns An array with only defined edges. If all edges are null/undefined, returns an empty array.
 */
const getDefinedEdges = <T>(
  input:
    | ({ node: T | undefined | null } | undefined | null)[]
    | ReadonlyArray<{ node: T | undefined | null } | undefined | null>
    | undefined
    | null,
): { node: T }[] => {
  if (Array.isArray(input))
    return input.filter(
      x => typeof x !== "undefined" && !isNull(x) && typeof x.node !== "undefined" && !isNull(x.node),
    ) as { node: T }[];
  return [];
};

export { toDefinedArray, getDefinedEdges };
