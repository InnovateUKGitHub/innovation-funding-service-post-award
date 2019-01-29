import "jest";
import { messageSuccess } from "../../../src/ui/redux/actions";

describe("messageSuccess", () => {
  it("should create message with type success", () => {
    const result = messageSuccess("test message");
    expect(result).toEqual({
      type: "MESSAGE_SUCCESS",
      payload: "test message"
    });
  });
});
