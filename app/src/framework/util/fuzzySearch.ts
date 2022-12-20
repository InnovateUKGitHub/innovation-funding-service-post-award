import Fuse from "fuse.js";

/**
 * Perform a fuzzy search on a list of items.
 *
 * @param value The user's input search value
 * @param items The list of items to search through
 * @param keysToSearch Keys in `item` that can be searched through
 * @returns A list of all items that match the user's input value.
 */
const fuzzySearch = <T>(value: string, items: T[], keysToSearch: string[]) => {
  const valueToSearch = value.trim();

  // TODO: reconfirm this value after migrating to Node16
  const scoreThreshold = 0.19;

  const fusedQuery = new Fuse(items, {
    threshold: scoreThreshold,
    includeScore: true,
    ignoreLocation: true,
    keys: keysToSearch,
  });

  const initialResults = fusedQuery.search(valueToSearch);

  // Note: Remove results outside of scoreThreshold - enforces stricter approach
  return initialResults.filter(x => Number(x.score?.toFixed(2)) <= scoreThreshold);
};

export { fuzzySearch };
