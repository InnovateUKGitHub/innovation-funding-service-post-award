type KeyValuePayload = [string, string];

type ContentBody = { [key: string]: { content: string } | ContentBody };

/**
 *
 * @description A small utility which is agnostic of nested data. It takes test stub content and returns a flat data structure [key, value] (handy for toBeInTheDocument() tests)
 * @example
 *
 * Input -> {
 *   level1Item1: {
 *   level2Item1: { content: "stub-level2Item1" },
 *     level2Item2: { content: "stub-level2Item2" },
 *     level2Item3: {
 *       level3Item2: { content: "stub-level3Item2" },
 *     },
 *   },
 *  };
 *
 * Output -> [["level2Item1", "stub-level2Item1"], ["level2Item2", "stub-level2Item2"], ["level3Item2", "stub-level3Item2"]]
 */
export function generateContentArray(payload: ContentBody): KeyValuePayload[] {
  if (!payload) return [];

  let output: KeyValuePayload[] = [];

  for (const contentKey in payload) {
    const childItem = payload[contentKey];
    const totalSubChildren = Object.keys(childItem).length;

    if (totalSubChildren === 0) {
      throw Error("Your object has no defined keys :(");
    }

    if (Array.isArray(childItem)) {
      throw Error("Sorry there is no support for array yet :(");
    }

    // Note: We have a valid ContentResult - get content value
    if (typeof childItem.content === "string") {
      const outputPayload: KeyValuePayload = [contentKey, childItem.content];

      output.push(outputPayload);
    } else {
      const childContentKeys = generateContentArray(childItem as ContentBody);

      if (Array.isArray(childContentKeys)) {
        output = [...output, ...childContentKeys];
      }
    }
  }

  return output;
}
