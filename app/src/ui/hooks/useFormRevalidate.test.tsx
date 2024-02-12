import { fireEvent, renderHook, cleanup } from "@testing-library/react";
import { useFormRevalidate } from "./useFormRevalidate";

describe("useFormRevalidate", () => {
  const trigger = jest.fn();
  const mockUnSubscribe = jest.fn();

  const watch = jest.fn().mockImplementation(cb => {
    window.addEventListener("change", cb);

    return {
      unsubscribe: mockUnSubscribe,
    };
  });

  beforeEach(cleanup);

  test("it should only force revalidate on changes after the submit action has been fired", () => {
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
});
