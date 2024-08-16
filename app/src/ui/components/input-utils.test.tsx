import { renderHook } from "@testing-library/react";
import { noop } from "@ui/helpers/noop";

import { useDebounce } from "./input-utils";

describe("useDebounce", () => {
  afterEach(jest.clearAllMocks);

  const action = jest.fn() as (x: number) => void;

  it("should call the function once after several updates in quick succession", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useDebounce(action, true));
    if (typeof result.current !== "function") {
      throw new Error("did not instantiate function from action");
    }
    const debouncedFn = result.current;
    debouncedFn(1);
    debouncedFn(2);
    debouncedFn(3);
    debouncedFn(4);
    jest.runAllTimers();
    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith(4);
    jest.useRealTimers();
  });

  it("should call the function un-debounced if allowDebounce is false", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useDebounce(action, false));
    if (typeof result.current !== "function") {
      throw new Error("did not instantiate function from action");
    }
    const debouncedFn = result.current;
    debouncedFn(1);
    debouncedFn(2);
    debouncedFn(3);
    debouncedFn(4);
    jest.runAllTimers();
    expect(action).toHaveBeenCalledTimes(4);
    expect(action).toHaveBeenCalledWith(1);
    expect(action).toHaveBeenCalledWith(2);
    expect(action).toHaveBeenCalledWith(3);
    expect(action).toHaveBeenCalledWith(4);
    jest.useRealTimers();
  });

  it("should return a noop function if the action is undefined", () => {
    const { result } = renderHook(() => useDebounce(undefined, false));

    expect(result.current.toString()).toEqual(noop.toString());
  });
});
