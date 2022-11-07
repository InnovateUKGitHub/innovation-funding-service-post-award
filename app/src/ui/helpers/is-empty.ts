type CommonDataTypes = object | string | number | boolean | undefined;

/**
 * asserts is plain empty object
 */
export function isEmpty(valueToCheck: object | null | undefined | CommonDataTypes | CommonDataTypes[]): boolean {
  if (valueToCheck === null || valueToCheck === undefined) return true;

  if (Array.isArray(valueToCheck)) return false;

  if (valueToCheck instanceof Date) return false;

  if (typeof valueToCheck === "number" || typeof valueToCheck === "bigint") return false;
  if (typeof valueToCheck === "boolean") return false;
  if (typeof valueToCheck === "string") return false;
  if (typeof valueToCheck === "symbol") return false;
  if (typeof valueToCheck === "function") return isEmpty(valueToCheck());

  if (typeof valueToCheck === "object") {
    const valueObjectKeys = Object.keys(valueToCheck);
    const hasNoObjectProperties = !valueObjectKeys.length;

    if (hasNoObjectProperties) return true;

    for (let index = 0; index < valueObjectKeys.length; index++) {
      const childKey = valueObjectKeys[index] as keyof typeof valueToCheck;
      const childValue = valueToCheck[childKey];

      // Note: Some data will contain null's we this is allows within object
      if (childValue === null) continue;

      const isChildValueEmpty = isEmpty(childValue);

      // Note: This checks each sibling node to see if it's defined (with value)
      if (isChildValueEmpty) return true;
    }

    // Note: At this point we've got through all nested siblings + children/grand-children
    return false;
  }

  // Note: Nothing should hit this - used as a fallback
  throw Error("No available typeof check was possible");
}
