import { renderHook } from "@testing-library/react-hooks";

import { GDSModules, useGovFrontend } from "@ui/hooks";
import { hookTestBed, TestBedStore } from "@shared/TestBed";

describe("useGovFrontend()", () => {
  const stubGdsInit = jest.fn();
  const stubGdsModule = jest.fn(() => ({
    init: stubGdsInit,
  }));

  const subGDSLibrary: Partial<GDSModules> = {
    Header: stubGdsModule,
  };

  const stubElement = document.createElement("div");

  Object.assign(window, { GOVUKFrontend: subGDSLibrary });

  beforeEach(jest.clearAllMocks);

  const setup = (isClient: boolean) => {
    const stubStore = {
      config: {
        isClient,
      },
    } as any;

    return renderHook(() => useGovFrontend("Header"), hookTestBed({ stores: stubStore as TestBedStore }));
  };

  test("should call when a node is available", () => {
    const { result } = setup(true);

    result.current.setRef(stubElement);

    expect(stubGdsInit).toHaveBeenCalledTimes(1);
    expect(stubGdsModule).toHaveBeenCalledTimes(1);
    expect(stubGdsModule).toBeCalledWith(stubElement);
  });

  describe("should not invoke gds library", () => {
    test.each`
      name                               | targetNode     | isClient
      ${"with client with node as null"} | ${null}        | ${true}
      ${"with server with node as null"} | ${null}        | ${false}
      ${"with server with a valid node"} | ${stubElement} | ${false}
    `("rendering $name", ({ targetNode, isClient }) => {
      const { result } = setup(isClient);

      result.current.setRef(targetNode);

      expect(stubGdsInit).not.toHaveBeenCalled();
      expect(stubGdsModule).not.toHaveBeenCalled();
    });
  });
});
