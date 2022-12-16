import { renderHook, render, screen } from "@testing-library/react";
import { noop } from "@ui/helpers/noop";
import { useState } from "react";

import { useDebounce, useUpdateStateValueOnPropsChange, useResetValueOnNameChange } from "./input-utils";

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

describe("useUpdateStateValueFromProps", () => {
  afterEach(jest.clearAllMocks);

  const TestComponent = ({ value }: { value: number }) => {
    const [state, setState] = useState<{ value: number }>({ value });
    useUpdateStateValueOnPropsChange(value, setState);
    return <h1 data-qa="hook-test">{state.value}</h1>;
  };

  it("should update the state with successive values, but not on the initial render", () => {
    const { rerender } = render(<TestComponent value={0} />);

    expect(screen.getByTestId("hook-test")).toHaveTextContent("0");
    rerender(<TestComponent value={1} />);
    expect(screen.getByTestId("hook-test")).toHaveTextContent("1");
  });
});

describe("useResetValueOnNameChange", () => {
  afterEach(jest.clearAllMocks);

  const TestComponent = ({ name }: { name: string }) => {
    const [state, setState] = useState<{ value: string }>({ value: "test value 1" });
    useResetValueOnNameChange(setState, name);
    return <h1 data-qa="hook-test">{state.value}</h1>;
  };

  it("should reset the state if the name changes, but not on the initial render", () => {
    const { rerender } = render(<TestComponent name="test-name-one" />);

    expect(screen.getByTestId("hook-test")).toHaveTextContent("test value 1");
    rerender(<TestComponent name="test-name-two" />);
    expect(screen.getByTestId("hook-test")).toHaveTextContent("");
  });
});
