/**
 * Is null check and type guard.
 *
 * Typechecking whether val `is null` helps the typechecker type-narrow whenever
 * the input is not null, by removing the possibility that val is null.
 *
 * @example
 * let x: string | null
 *
 * console.log(x.length) // type error, x is possibly null
 *
 * if(isNull(x)) {
 *  // do something
 * } else {
 *   console.log(x.length) // type narrowed to string by this point
 * }
 */
function isNull(val: unknown): val is null {
  return val === null;
}

export default isNull;
