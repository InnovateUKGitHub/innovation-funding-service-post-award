import { renderHook } from "@testing-library/react";
import { useDidUpdate, useDidMount } from "./generic.hook";

describe("generic hooks", () => {
  const cb = jest.fn();
  beforeEach(jest.clearAllMocks);

  describe("useDidUpdate", () => {
    it("should not be called when initially mounted", () => {
      renderHook(() => useDidUpdate(cb));
      expect(cb).not.toHaveBeenCalled();
    });

    it("should call the call back on every subsequent update", () => {
      let dependency = 1;
      const { rerender } = renderHook(() => useDidUpdate(cb, [dependency]));
      expect(cb).not.toHaveBeenCalled();
      dependency = 2;
      rerender();
      dependency = 3;
      rerender();
      expect(cb).toHaveBeenCalledTimes(2);
    });
  });

  describe("useDidMount", () => {
    it("should call the callback on initial mount and not thereafter", () => {
      const { rerender } = renderHook(() => useDidMount(cb));
      expect(cb).toHaveBeenCalledTimes(1);
      rerender();
      rerender();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });
});
