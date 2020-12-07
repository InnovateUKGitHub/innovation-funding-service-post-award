import { renderHook } from "@testing-library/react-hooks";

import { GDSModules, useGovFrontend } from "@ui/hooks";

describe("useGovFrontend()", () => {
  const stubGdsInit = jest.fn();
  const stubGdsModule = jest.fn(() => ({
    init: stubGdsInit,
  }));

  const subGDSLibrary: Partial<GDSModules> = {
    Header: stubGdsModule,
  };

  Object.assign(window, { GOVUKFrontend: subGDSLibrary });

  beforeEach(jest.clearAllMocks);

  const setup = () => renderHook(() => useGovFrontend("Header"));

  test("should call when a node is available", () => {
    const { result } = setup();

    const stubElement = document.createElement("div");
    result.current.setRef(stubElement);

    expect(stubGdsInit).toHaveBeenCalledTimes(1);
    expect(stubGdsModule).toHaveBeenCalledTimes(1);
    expect(stubGdsModule).toBeCalledWith(stubElement);
  });

  test("should not invoke gds library when a node is not present", () => {
    const { result } = setup();

    const stubElement = null;
    result.current.setRef(stubElement);

    expect(stubGdsInit).not.toHaveBeenCalled();
    expect(stubGdsModule).not.toHaveBeenCalled();
  });
});
