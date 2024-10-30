import { renderHook } from "@testing-library/react";
import { hookTestBed } from "@shared/TestBed";
import { GDSModules, useGovFrontend } from "./gov-frontend.hook";

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

  const setup = (isServer: boolean) => renderHook(() => useGovFrontend("Header"), hookTestBed({ isServer }));

  test("should call when a node is available", () => {
    const { result } = setup(false);

    result.current.setRef(stubElement);

    expect(stubGdsInit).toHaveBeenCalledTimes(1);
    expect(stubGdsModule).toHaveBeenCalledTimes(1);
    expect(stubGdsModule).toHaveBeenCalledWith(stubElement);
  });

  describe("should not invoke gds library", () => {
    test.each`
      name                               | targetNode     | isServer
      ${"with client with node as null"} | ${null}        | ${false}
      ${"with server with node as null"} | ${null}        | ${true}
      ${"with server with a valid node"} | ${stubElement} | ${true}
    `("rendering $name", ({ targetNode, isServer }) => {
      const { result } = setup(isServer);

      result.current.setRef(targetNode);

      expect(stubGdsInit).not.toHaveBeenCalled();
      expect(stubGdsModule).not.toHaveBeenCalled();
    });
  });
});
