import "jest";
import { dataLoadAction } from "../../../src/ui/redux/actions";

describe("dataLoadAction", () => {
  it("should create dataLoadAction", () => {
    const result = dataLoadAction("a", "b", "c" as any, {});
    expect(result.type).toBe("DATA_LOAD");
  });

  it("should have correct payload", () => {
    const result = dataLoadAction("a", "b", "c" as any, {});
    const expected = {
      id: "a",
      store: "b",
      status: "c",
      data: {}
    };
    expect(result.payload).toMatchObject(expected);
  });

  it("should have correct payload with error", () => {
    const result = dataLoadAction("a", "b", "c" as any, "d", "e");
    const expected = {
      id: "a",
      store: "b",
      status: "c",
      data: "d",
      error: "e"
    };
    expect(result.payload).toMatchObject(expected);
  });
});
