import { initStubTestIntl } from "@shared/initStubTestIntl";
import { getTextareaValidation } from "./textareaValidator.zod";
import { makeZodI18nMap } from "@shared/zodi18n";

describe("generic textarea validator", () => {
  beforeAll(async () => {
    await initStubTestIntl({
      forms: {
        errors: {
          generic: {
            textarea: {
              required: "{{ label }} required!",
              invalid_range: "{{ label }} {{ count }} not between {{ min }} {{ max }}!",
              too_small: "{{ label }} must be bigger than {{ count }}!",
              too_big: "{{ label }} must be smaller than {{ count }}!",
            },
          },
        },
        my: {
          nice: {
            error: {
              label: "ARTMS",
            },
          },
        },
      },
    });
  });

  test.each([
    ["non required empty", null, false, true],
    ["required empty", null, true, false],
    ["too small", "ops", true, false],
    ["too big", "this is much too big and impossible", true, false],
    ["acceptable", "acceptable", true, true],
  ])("%s", (name, input, required, accept) => {
    const errorMap = makeZodI18nMap({ keyPrefix: ["my", "nice", "error"] });
    const parse = getTextareaValidation({
      maxLength: 20,
      minLength: 5,
      required: required,
    }).safeParse(input, { errorMap });
    expect(parse.success).toBe(accept);
    expect(parse).toMatchSnapshot();
  });
});
