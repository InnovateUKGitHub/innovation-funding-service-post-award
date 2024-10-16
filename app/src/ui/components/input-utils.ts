import { useRef } from "react";
import noop from "lodash/noop";

export type FormInputWidths =
  | "full"
  | "three-quarters"
  | "two-thirds"
  | "one-half"
  | "one-third"
  | "one-quarter"
  | 2
  | 3
  | 4
  | 5
  | 10
  | 20;

export const defaultInputDebounceTimeout = 250;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BasicFn = (...args: any[]) => unknown;

/**
 * Hook returns a debounced action with the same interface as the original action
 * or return `noop` if the action is undefined
 *
 * @example
 * const debouncedOnChange = useDebounce(props.onChange, true, 500);
 */
export function useDebounce<T extends BasicFn>(
  action: T | undefined,
  allowDebounce = true,
  timeout: number = defaultInputDebounceTimeout,
) {
  const timeoutId = useRef<number>(0);
  if (!action || typeof action !== "function") return noop;

  if (allowDebounce === false) return action;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => action(...args), timeout);
  };
}
