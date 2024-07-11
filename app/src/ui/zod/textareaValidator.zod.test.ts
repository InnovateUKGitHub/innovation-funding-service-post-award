import { getTextareaValidation } from "./textareaValidator.zod";

describe("generic textarea validator", () => {
  test.each([
    ["non required empty", null, false, true],
    ["required empty", null, true, false],
    ["too small", "ops", true, false],
    ["too big", "this is much too big and impossible", true, false],
    ["acceptable", "acceptable", true, true],
  ])("%s", (name, input, required, accept) => {
    const parse = getTextareaValidation({
      label: "description",
      maxLength: 20,
      minLength: 5,
      required: required,
    }).safeParse(input);
    expect(parse.success).toBe(accept);
    expect(parse as unknown).toMatchSnapshot();
  });
});
