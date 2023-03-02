import isNull from "@ui/helpers/is-null";

type Leaf<T> = T | undefined | null;
type Edge<T> = Leaf<{ node: Leaf<T> }>;
type Edges<T> = Leaf<Edge<T>[] | ReadonlyArray<Edge<T>>>;

/**
 * Discard all null/undefined nodes within a GraphQL edge
 *
 * @param input An array of edges to filter null/undefined results out of.
 * @returns An array with only defined edges. If all edges are null/undefined, returns an empty array.
 */
const getDefinedEdges = <T>(input: Edges<T>): { node: T }[] => {
  if (Array.isArray(input))
    return input.filter(
      x => typeof x !== "undefined" && !isNull(x) && typeof x.node !== "undefined" && !isNull(x.node),
    ) as { node: T }[];
  return [];
};

/**
 * Selects the first defined edge in an array of edges.
 * Will throw an error if the number of edges is not 1.
 *
 * @param input An array of edges to obtain the first result from.
 * @returns An array with only defined edges.
 */
const getFirstEdge = <T>(input: Edges<T>): { node: T } => {
  const edges = getDefinedEdges(input);
  if (edges.length === 0) throw new Error("No GraphQL edges detected when 1 was expected.");
  if (edges.length > 1) throw new Error("Multiple GraphQL edges detected when only 1 was expected.");
  return edges[0];
};

export { getDefinedEdges, getFirstEdge };
