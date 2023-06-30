import { renderHook, act } from "@testing-library/react";
import { useOnUpdate } from "./onUpdate";
import * as windowHelpers from "@framework/util/windowHelpers";

jest.spyOn(windowHelpers, "scrollToTheTopSmoothly").mockImplementation();

describe("useOnUpdate", () => {
  const onSuccess = jest.fn();
  const onError = jest.fn();
  global.window.scrollTo = jest.fn();

  const renderSuccessHook = () =>
    renderHook(() => useOnUpdate({ req: data => Promise.resolve(data), onSuccess, onError }));

  const renderFailHook = () =>
    renderHook(() =>
      useOnUpdate({
        req: () => Promise.reject({ code: 1, message: "Leo forgot his mama noodles" }),
        onSuccess,
        onError,
      }),
    );

  beforeEach(jest.clearAllMocks);
  it("should return an object with on `onUpdate` and an `apiError` property", () => {
    const { result } = renderSuccessHook();

    expect(result.current).toMatchSnapshot();
  });

  it("should call the success method and no errors if the promise resolves", async () => {
    const { result } = renderSuccessHook();

    await act(() => result.current.onUpdate({ data: { postcode: "SN1 2AP" } }));

    expect(result.current.apiError).toBe(null);
    expect(onSuccess).toHaveBeenCalledWith({ postcode: "SN1 2AP" }, { postcode: "SN1 2AP" }, undefined);
    expect(onError).not.toHaveBeenCalled();
  });

  it("should call the error method and show the apiError if the promise rejects", async () => {
    const { result } = renderFailHook();
    await act(() => result.current.onUpdate({ data: { postcode: "SN1 2AP" } }));

    expect(result.current.apiError).toEqual({ code: 1, message: "Leo forgot his mama noodles" });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should pass in an input ctx to the success callback", async () => {
    const { result } = renderSuccessHook();
    await act(() => result.current.onUpdate({ data: { poland: "Poland" }, context: { bulgoggi: "Burger" } }));

    expect(result.current.apiError).toBe(null);
    expect(onSuccess).toHaveBeenCalledWith({ poland: "Poland" }, { poland: "Poland" }, { bulgoggi: "Burger" });
    expect(onError).not.toHaveBeenCalled();
  });
});
