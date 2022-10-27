import { renderHook } from "@testing-library/react";
import { useDidUpdate } from "./generic.hook";

describe("generic hooks", () => {
  describe("useDidUpdate", () => {
    it("should not be called when initially mounted", () => {
      const cb = jest.fn();
      renderHook(() => useDidUpdate(cb));
      expect(cb).not.toBeCalled();
    });

    it("should call the call back on every subsequent update", () => {
      const cb = jest.fn();
      let dependency = 1;
      const { rerender } = renderHook(() => useDidUpdate(cb, [dependency]));
      expect(cb).not.toBeCalled();
      dependency = 2;
      rerender();
      dependency = 3;
      rerender();
      expect(cb).toBeCalledTimes(2);
    });
  });
});
