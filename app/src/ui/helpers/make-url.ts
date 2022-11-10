/**
 * Constructs a url based on the passed in parameters
 */
export function makeUrlWithQuery(path: string, routeParams: AnyObject): string {
  if (!routeParams || Object.keys(routeParams).length === 0) return path.replace(/\?:.+/, "");
  const tokenKeysAsString = Object.keys(routeParams).join("|");

  /**
   * replace parameters as part of the url before the query
   *
   * @example
   * `/project/:projectId/` => `/project/ktp3001/`
   */
  const tokenRegex = new RegExp(`([^?^&]):(${tokenKeysAsString})`, "g");

  /**
   * replace query parameter but preserve the label.
   *
   * @example
   * `project?:search` => `project?search=123`
   */
  const queryRegex = new RegExp(`([&?]):(${tokenKeysAsString})`, "g");

  return path
    .replace(tokenRegex, (_: string, p1: string, p2: string) => `${p1}${encodeURIComponent(routeParams[p2])}`)
    .replace(queryRegex, (_: string, p1: string, p2: string) => `${p1}${p2}=${encodeURIComponent(routeParams[p2])}`);
}

/**
 * converts string value to number if possible
 * or returns original string
 */
function toNumber(value: string) {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }
  return value;
}

export type Params = Record<string, string | string[] | number>;
interface IParams {
  queryParams: Params;
  routePathParams: Params;
  params: Params;
}

/**
 * Parse a pathname based on a route path, and obtain the associated parameters.
 *
 * @param routePath The shape of the route to parse upon
 * @param pathname The path the user has requested
 * @param search Search parameters (as a string)
 * @returns A record of all parameters passed in from the client.
 */
export function getParamsFromUrl(routePath: string, pathname: string, search = ""): IParams {
  const parts = routePath.split(/[/?]/);
  const values = pathname.split(/[/?]/);
  const usedRouteParts = new Set<string>();

  // Parse the params that are within the "routePath"
  const routePathParams: Params = parts.reduce(
    (acc: Params, cur, i) => (/^:/.test(cur) ? { ...acc, [cur.replace(":", "")]: toNumber(values[i]) } : acc),
    {},
  );

  // Parse the params that are within the "search"
  const queryParams: Params = {};
  const query = new URLSearchParams(search);

  // Parse each value into either a string[], string or number.
  for (const [k, v] of query.entries()) {
    // Ensure that only params marked with "array" are parsed as an array.
    if (usedRouteParts.has(k)) {
      // nothing
    } else if (k.startsWith("array")) {
      // Get the param with the specified fieldName
      // Used to help type-narrow `val`.
      const val = queryParams[k];

      // If the array exists, push onto the stack.
      // Otherwise, create a new array.
      if (Array.isArray(val)) {
        val.push(v);
      } else {
        queryParams[k] = [v];
      }
    } else {
      queryParams[k] = toNumber(v);
    }
  }

  // Merge both params together, with routePathParams taking priority.
  return {
    queryParams,
    routePathParams,
    params: {
      ...queryParams,
      ...routePathParams,
    },
  };
}
