import { useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { noop } from "@ui/helpers/noop";
import { useDidUpdate } from "@ui/hooks";

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
  if (!action) return noop;

  if (allowDebounce === false) return action;

  return (...args: T extends BasicFn ? Parameters<T> : never) => {
    window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => action(...args), timeout);
  };
}

/**
 * Hook will update the state value property when props change (not on initial mount)
 */
export function useUpdateStateValueOnPropsChange<S>(value: S, setState: Dispatch<SetStateAction<{ value: S }>>) {
  useDidUpdate(() => {
    setState(s => ({ ...s, value }));
  }, [value]);
}
