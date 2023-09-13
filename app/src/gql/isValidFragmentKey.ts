/**
 * This type guard will narrow the type from the UseFragmentContext hook
 * 
 * @example
   if (!isValidFragmentKey<ClaimTableFragment$key>(fragmentRef, "ClaimTableFragment")) {
    throw new Error("Claim Table is missing a ClaimTableFragment reference");
  }
 */
export function isValidFragmentKey<T>(fragmentRef: T | unknown, key: string): fragmentRef is T {
  return (
    !!fragmentRef &&
    typeof fragmentRef === "object" &&
    ((" $data" in fragmentRef &&
      " $fragmentSpreads" in fragmentRef &&
      !!fragmentRef[" $fragmentSpreads"] &&
      typeof fragmentRef[" $fragmentSpreads"] === "object" &&
      key in fragmentRef[" $fragmentSpreads"]) ||
      ("__fragments" in fragmentRef &&
        !!fragmentRef["__fragments"] &&
        typeof fragmentRef["__fragments"] === "object" &&
        key in fragmentRef["__fragments"]))
  );
}
