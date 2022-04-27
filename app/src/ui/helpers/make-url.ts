export function makeUrlWithQuery(path: string, routeParams: any): string {
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

function toNumber(value: string) {
  const num = Number(value);
  return Number.isNaN(num) ? value : num;
}

export function getParamsFromUrl(routePath: string, pathname: string, search = ""):  Record<string, string | number> {
  const parts = routePath.split(/[/?]/);
  const values = pathname.split(/[/?]/);

  const params: Record<string, string | number> = parts.reduce(
    (acc, cur, i) => (/^:/.test(cur) ? { ...acc, [cur.replace(":", "")]: toNumber(values[i]) } : acc),
    {},
  );

  const query = new URLSearchParams(search).entries();
  for(const [k, v] of query) {
    params[k] = toNumber(v);
  }
  return params;
}
