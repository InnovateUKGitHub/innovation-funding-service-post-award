import { fireEvent, renderHook, cleanup } from "@testing-library/react";
import { useFormRevalidate } from "./useFormRevalidate";

describe("useFormRevalidate", () => {
  const mockUnSubscribe = jest.fn();

  const watch = jest.fn().mockImplementation(cb => {
    window.addEventListener("change", cb);

    return {
      unsubscribe: mockUnSubscribe,
    };
  });

  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test("it should only force revalidate on changes after the submit action has been fired", () => {
    const trigger = jest.fn();
    const { unmount } = renderHook(() => useFormRevalidate(watch, trigger));
    expect(trigger).not.toHaveBeenCalled();
    fireEvent(window, new Event("change"));
    expect(trigger).not.toHaveBeenCalled();
    fireEvent(window, new Event("submit"));
    fireEvent(window, new Event("change"));
    expect(trigger).toHaveBeenCalledTimes(1);
    fireEvent(window, new Event("change"));
    expect(trigger).toHaveBeenCalledTimes(2);
    unmount();
    expect(mockUnSubscribe).toHaveBeenCalledTimes(1);
  });

  test("it should reset the form to require submit before validating if the resetState function is called", () => {
    const trigger = jest.fn();
    const { unmount, result } = renderHook(() => useFormRevalidate(watch, trigger));
    const resetState = result.current.resetState;
    expect(trigger).not.toHaveBeenCalled();
    fireEvent(window, new Event("change"));
    expect(trigger).not.toHaveBeenCalled();
    fireEvent(window, new Event("submit"));
    fireEvent(window, new Event("change"));
    expect(trigger).toHaveBeenCalledTimes(1);
    fireEvent(window, new Event("change"));
    expect(trigger).toHaveBeenCalledTimes(2);
    resetState();
    fireEvent(window, new Event("change"));
    expect(trigger).toHaveBeenCalledTimes(2);
    fireEvent(window, new Event("submit"));
    fireEvent(window, new Event("change"));
    expect(trigger).toHaveBeenCalledTimes(3);
    fireEvent(window, new Event("change"));
    expect(trigger).toHaveBeenCalledTimes(4);
    unmount();
    expect(mockUnSubscribe).toHaveBeenCalledTimes(1);
  });
});
