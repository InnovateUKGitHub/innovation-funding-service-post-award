
import { createAction } from "../../../src/ui/redux/actions/common";

describe("createAction", () => {
  it("should create action with only type param", () => {
    const result   = createAction("TEST");
    const expected = { type: "TEST" };
    expect(result).toMatchObject(expected);
  });

  it("should create action with type & payload", () => {
    const result   = createAction("TEST", { testPl: "testing" });
    const expected = {type: "TEST", payload: { testPl: "testing" }};
    expect(result).toMatchObject(expected);
  });
});
