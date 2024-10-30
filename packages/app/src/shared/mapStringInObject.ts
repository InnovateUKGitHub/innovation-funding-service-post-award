/**
 * Map over ALL strings within an input, whether they are a property of an object, or an item in an array.
 *
 * @see https://stackoverflow.com/a/61468871
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStringInObject = (object: unknown, replacer: (original: string) => string): any => {
  if (object === null) {
    return null;
  }

  if (typeof object === "undefined") {
    return undefined;
  }

  if (typeof object === "string") {
    return replacer(object);
  }

  if (Array.isArray(object)) {
    return object.map(x => mapStringInObject(x, replacer));
  }

  if (typeof object === "object") {
    const output: AnyObject = {};

    for (const [key, value] of Object.entries(object)) {
      output[key] = mapStringInObject(value, replacer);
    }

    return output;
  }

  return object;
};

export { mapStringInObject };
